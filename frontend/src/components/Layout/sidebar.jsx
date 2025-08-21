import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="bg-primary text-white w-60 h-screen p-6 shadow-lg">
      <h2 className="text-lg font-bold mb-6">Menu</h2>
      <ul className="space-y-4">
        <li><Link to="/dashboard" className="hover:text-accent">Dashboard</Link></li>
        <li><Link to="/properties" className="hover:text-accent">Properties</Link></li>
        <li><Link to="/transactions" className="hover:text-accent">Transactions</Link></li>
        <li><Link to="/profile" className="hover:text-accent">Profile</Link></li>
      </ul>
    </aside>
  );
}
