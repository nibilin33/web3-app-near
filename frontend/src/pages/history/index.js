import { useEffect, useState,useContext } from "react";
import { Table, Container, Spinner, Alert } from "react-bootstrap";
import { NearContext } from "@/wallets/near";
import { FlicpNearContract } from "@/config";


export default function History() {
  const { wallet, signedAccountId } = useContext(NearContext);
  const [results, setResults] = useState([]);
  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!wallet) {
        setLoading(false);
        return
    }
    fetchResults();
  }, [wallet]);
  async function fetchResults() {
    try {
      const data = await wallet.viewMethod({
        contractId: FlicpNearContract,
        method: "get_game_results"
      });
      setResults(data);
      const bets = await wallet.viewMethod({
        contractId: FlicpNearContract,
        method: "get_user_records",
        args: { player: signedAccountId }
      });
      setBets(bets);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }
  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading game results...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h1 className="mb-4">Bet History</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Player</th>
            <th>Player Guess</th>
            <th>Amount</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {bets.map((result, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{result.player}</td>
              <td>{result.player_guess}</td>
              <td>{result.amount} NEAR</td>
              <td>{new Date(result.timestamp / 1e6).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h1 className="mb-4">Game Results</h1>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Player</th>
            {/* <th>Player Guess</th> */}
            <th>Outcome</th>
            {/* <th>Amount</th> */}
            <th>Result</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{result.player}</td>
              {/* <td>{result.player_guess}</td> */}
              <td>{result.outcome}</td>
              {/* <td>{result.amount} NEAR</td> */}
              <td>{result.result === "win" ? "Win" : "Lose"}</td>
              <td>{new Date(result.timestamp / 1e6).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    
     
    </Container>
  );
}
