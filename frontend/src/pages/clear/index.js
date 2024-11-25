import { useEffect, useState,useContext } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import { NearContext } from "@/wallets/near";
import { FlicpNearContract } from "@/config";


export default function ClearHistory() {
  const { wallet, signedAccountId } = useContext(NearContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (wallet) {
        fetchResults();
    }
  }, [wallet]);
  async function fetchResults() {
    try {
      await wallet.callMethod({
        contractId: FlicpNearContract,
        method: "clear_all_records"
      });
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
        <p>Clear results...</p>
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
      <h1 className="mb-4">clear History</h1>
    </Container>
  );
}
