import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

export default function Clients() {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[#001B48]">Clients</h1>
      </div>

      <div className="bg-white rounded-2xl shadow">
        <div className="p-6">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left text-[#001B48] font-bold">Name</th>
                <th className="text-left text-[#001B48] font-bold">Email</th>
                <th className="text-left text-[#001B48] font-bold">Phone</th>
                <th className="text-left text-[#001B48] font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Sample client data - Replace with real data */}
              <tr className="border-t">
                <td className="py-4">John Doe</td>
                <td className="py-4">john@example.com</td>
                <td className="py-4">+1 234 567 8901</td>
                <td className="py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    Active
                  </span>
                </td>
              </tr>
              <tr className="border-t">
                <td className="py-4">Jane Smith</td>
                <td className="py-4">jane@example.com</td>
                <td className="py-4">+1 234 567 8902</td>
                <td className="py-4">
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                    Pending
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
