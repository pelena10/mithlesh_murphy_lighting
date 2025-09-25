import { useEffect, useState } from "react";
import axios from "axios";
import MainCard from "components/MainCard";
import { Table } from "react-bootstrap";

export default function PendingDNs() {
  const [pendingDns, setPendingDns] = useState([]);

  useEffect(() => {
    const fetchPendingDns = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/dn/pending");
        setPendingDns(res.data);
      } catch (err) {
        console.error("Failed to fetch pending DNs:", err);
      }
    };
    fetchPendingDns();
  }, []);

  return (
    <MainCard title="Pending Delivery Notes">
      <Table bordered responsive>
        <thead className="table-primary text-center">
          <tr>
            <th>DN ID</th>
            <th>Customer</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {pendingDns.map((dn) => (
            <tr key={dn.id}>
              <td>{dn.id}</td>
              <td>{dn.customer_name}</td>
              <td>{dn.date}</td>
              <td>{dn.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </MainCard>
  );
}
