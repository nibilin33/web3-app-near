import { NearBindgen, near, call, view, UnorderedMap, Vector, NearPromise } from 'near-sdk-js';
import { AccountId } from 'near-sdk-js/lib/types';

type Side = 'heads' | 'tails'
interface Bet {
  player: AccountId;
  player_guess: Side;
  amount: string;
  timestamp: number;
}
interface GameResult {
  player: AccountId;
  player_guess: Side;
  outcome: Side;
  amount: string;
  result: string; // 'win' or 'lose'
  timestamp: number;
}

function simulateCoinFlip(): Side {
  // randomSeed creates a random string, learn more about it in the README
  const randomString: string = near.randomSeed().toString();
  let randomValue = 0;
  for (let i = 0; i < randomString.length; i++) {
    randomValue += randomString.charCodeAt(i);
  }
  // If the last charCode is even we choose heads, otherwise tails
  return randomValue % 2 ? 'heads' : 'tails';
}


@NearBindgen({})
class CoinFlip {
  points: UnorderedMap<number> = new UnorderedMap<number>("points");
  bets: Vector<Bet> = new Vector("bets");
  game_results: Vector<GameResult> = new Vector("game_results");
  outcomes: UnorderedMap<string> = new UnorderedMap<string>("outcomes");

  static schema = {
    points: { class: UnorderedMap, value: 'number' },
    bets: { class: Vector, value: 'object' },
    game_results: { class: Vector, value: 'object' },
    outcomes: { class: UnorderedMap, value: 'string' },
  }

  @call({})
  place_bet({ player_guess, amount }: { player_guess: Side, amount: string }): void {
    const player: AccountId = near.predecessorAccountId();
    near.log(`${player} placed a bet of ${amount} NEAR on ${player_guess}`);
    // if (deposit < betAmount) {
    //   throw new Error(`You need to attach at least ${betAmount} NEAR to play!`);
    // }
    this.bets.push({ player, player_guess, amount, timestamp: Number(near.blockTimestamp()) });
  }
  @call({})
  register_user(): void {
    const user: AccountId = near.predecessorAccountId();
    near.log(`User ${user} registered.`);
  }
  @call({})
  flip_coin({ player_guess }: { player_guess: Side }): Side {
    // Check who called the method
    const player: AccountId = near.predecessorAccountId();
    near.log(`${player} chose ${player_guess}`);

    // Simulate a Coin Flip
    const outcome = simulateCoinFlip();

    // Get the current player points
    let player_points: number = this.points.get(player, { defaultValue: 0 })

    // Check if their guess was right and modify the points accordingly
    if (player_guess == outcome) {
      near.log(`The result was ${outcome}, you get a point!`);
      player_points += 1;
    } else {
      near.log(`The result was ${outcome}, you lost a point`);
      player_points = player_points ? player_points - 1 : 0;
    }

    // Store the new points
    this.points.set(player, player_points)

    return outcome
  }
  @call({})
  bet_flip_coin({ player_guess, amount }: { player_guess: Side, amount: string }) {
    const player: AccountId = near.predecessorAccountId();
    const outcome = simulateCoinFlip();
    let player_points: number = this.points.get(player, { defaultValue: 0 });
    const result = player_guess === outcome;
    if (result) {
      near.log(`The result was ${outcome}, ${player} wins!`);
      player_points += 1;
    } else {
      near.log(`The result was ${outcome}, ${player} loses.`);
      player_points = player_points ? player_points - 1 : 0;
    }
    this.points.set(player, player_points);
      // 存储游戏结果
    this.game_results.push({
      player,
      player_guess: player_guess,
      outcome,
      amount: amount,
      result: result ? 'win' : 'lose',
      timestamp: Number(near.blockTimestamp()),
    });
    
    if(result){
      const reward = BigInt(amount) * BigInt(2);
      const promiseIndex = near.promiseBatchCreate(player);
      near.promiseBatchActionTransfer(promiseIndex, reward);
    }
    return outcome;
  }

  // View how many points a specific player has
  @view({})
  points_of({ player }: { player: AccountId }): number {
    try {
      const points = this.points.get(player, { defaultValue: 0 })
      near.log(`Points for ${player}: ${points}`)
      return points
    } catch (error) {
      return 0;
    }
  
  }
  @view({})
  get_outcome_of({ player }: { player: AccountId }): string {
    try {
      const outcome = this.outcomes.get(player, { defaultValue: null })
      near.log(`outcome for ${player}: ${outcome}`)
      return outcome
    } catch (error) {
      return null;
    }
  }
  // View all the bets
  @view({})
  get_bets(): Array<object> {
    const bets = [];
    for (let i = 0; i < this.bets.length; i++) {
      bets.push(this.bets.get(i));
    }
    return bets;
  }
  // View all the game results
  @view({})
  get_game_results(): Array<GameResult> {
    const results = [];
    for (let i = 0; i < this.game_results.length; i++) {
      results.push(this.game_results.get(i));
    }
    return results;
  }
  // View all the game results of a specific player
  @view({})
  get_user_records({ player }: { player: AccountId }): Array<GameResult> {
    const userRecords = [];
    for (let i = 0; i < this.game_results.length; i++) {
      const record = this.game_results.get(i);
      if (record.player === player) {
        userRecords.push(record);
      }
    }
    return userRecords;
  }
}