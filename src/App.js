
import React, { useState } from "react";
import axios from "axios";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function App() {

  // =========================
  // User States
  // =========================
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // =========================
  // Savings States
  // =========================
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [affordabilityMessage, setAffordabilityMessage] = useState("");

  // =========================
  // Loan States
  // =========================
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");

  // =========================
  // Property States
  // =========================
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);

  // =========================
  // Buyers States
  // =========================
  const [buyers, setBuyers] = useState([]);

  // =========================
  // Chart Data
  // =========================
  const chartData = {
    labels: ["Income", "Expenses"],

    datasets: [
      {
        label: "Financial Overview",

        data: [
          income || 0,
          expenses || 0
        ],

        backgroundColor: [
          "#198754",
          "#dc3545"
        ]
      }
    ]
  };

  // =========================
  // Register Function
  // =========================
  const registerUser = async () => {

    try {

      const response = await axios.post(
        "http://127.0.0.1:5000/register",
        {
          name,
          email,
          password
        }
      );

      alert(response.data.message);

    } catch (error) {

      alert("Registration Failed");
    }
  };

  // =========================
  // Login Function
  // =========================
  const loginUser = async () => {

    try {

      const response = await axios.post(
        "http://127.0.0.1:5000/login",
        {
          email,
          password
        }
      );

      alert(response.data.message);

    } catch (error) {

      alert("Login Failed");
    }
  };

  // =========================
  // Savings Function
  // =========================
  const addSavings = async () => {

    try {

      const response = await axios.post(
        "http://127.0.0.1:5000/add-savings",
        {
          user_id: 1,
          income,
          expenses
        }
      );

      const savings = response.data.total_savings;

      alert(
        "Savings Added: ₹" + savings
      );

      if (savings >= 30000) {

        setAffordabilityMessage(
          "✅ You are eligible to buy affordable properties."
        );

      } else {

        setAffordabilityMessage(
          "❌ Your savings are currently low for buying a property."
        );
      }

    } catch (error) {

      alert("Savings Failed");
    }
  };

  // =========================
  // Loan Function
  // =========================
  const calculateLoan = async () => {

    try {

      const response = await axios.post(
        "http://127.0.0.1:5000/calculate-loan",
        {
          user_id: 1,
          loan_amount: loanAmount,
          interest_rate: interestRate,
          tenure: tenure
        }
      );

      alert(
        "Monthly EMI: ₹" +
        response.data.EMI
      );

    } catch (error) {

      alert("Loan Calculation Failed");
    }
  };

  // =========================
  // Get Properties
  // =========================
  const getProperties = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:5000/get-properties"
      );

      setProperties(response.data);
      setFilteredProperties([]);

    } catch (error) {

      alert("Failed to Load Properties");
    }
  };

  // =========================
  // Filter Properties
  // =========================
  const filterProperties = (type) => {

    if (type === "low") {

      const result = properties.filter(
        (property) => property.price <= 5000000
      );

      setFilteredProperties(result);

    } else if (type === "medium") {

      const result = properties.filter(
        (property) =>
          property.price > 5000000 &&
          property.price <= 10000000
      );

      setFilteredProperties(result);

    } else {

      const result = properties.filter(
        (property) => property.price > 10000000
      );

      setFilteredProperties(result);
    }
  };

  // =========================
  // Get Buyers
  // =========================
  const getBuyers = async () => {

    try {

      const response = await axios.get(
        "http://127.0.0.1:5000/admin-buyers"
      );

      setBuyers(response.data);

    } catch (error) {

      alert("Failed to Load Buyers");
    }
  };

  return (

    <div>

      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark p-3">

        <div className="container-fluid">

          <h2 className="text-white">
            🏠 MyHome
          </h2>

        </div>

      </nav>

      {/* Main Container */}
      <div className="container mt-5">

        <h1 className="text-center mb-5">
          Smart Real Estate Dashboard
        </h1>

        {/* Register */}
        <div className="card p-4 mb-4 shadow">

          <h2>Register</h2>

          <input
            className="form-control mb-3"
            type="text"
            placeholder="Enter Name"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="form-control mb-3"
            type="email"
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="form-control mb-3"
            type="password"
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="btn btn-primary"
            onClick={registerUser}
          >
            Register
          </button>

        </div>

        {/* Login */}
        <div className="card p-4 mb-4 shadow">

          <h2>Login</h2>

          <input
            className="form-control mb-3"
            type="email"
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="form-control mb-3"
            type="password"
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="btn btn-success"
            onClick={loginUser}
          >
            Login
          </button>

        </div>

        {/* Savings */}
        <div className="card p-4 mb-4 shadow">

          <h2>Savings Dashboard</h2>

          <input
            className="form-control mb-3"
            type="number"
            placeholder="Enter Income"
            onChange={(e) => setIncome(e.target.value)}
          />

          <input
            className="form-control mb-3"
            type="number"
            placeholder="Enter Expenses"
            onChange={(e) => setExpenses(e.target.value)}
          />

          <button
            className="btn btn-warning"
            onClick={addSavings}
          >
            Calculate Savings
          </button>

          <h4 className="mt-3">
            {affordabilityMessage}
          </h4>

          <div className="mt-4">

            <Bar data={chartData} />

          </div>

        </div>

        {/* Loan */}
        <div className="card p-4 mb-4 shadow">

          <h2>Loan EMI Calculator</h2>

          <input
            className="form-control mb-3"
            type="number"
            placeholder="Enter Loan Amount"
            onChange={(e) => setLoanAmount(e.target.value)}
          />

          <input
            className="form-control mb-3"
            type="number"
            placeholder="Enter Interest Rate"
            onChange={(e) => setInterestRate(e.target.value)}
          />

          <input
            className="form-control mb-3"
            type="number"
            placeholder="Enter Tenure (Years)"
            onChange={(e) => setTenure(e.target.value)}
          />

          <button
            className="btn btn-danger"
            onClick={calculateLoan}
          >
            Calculate EMI
          </button>

        </div>

        {/* Properties */}
        <div className="card p-4 mb-4 shadow">

          <h2>Recommended Properties</h2>

          <button
            className="btn btn-dark mb-4"
            onClick={getProperties}
          >
            View Properties
          </button>

          {/* Filter Buttons */}
          <div className="mb-4">

            <button
              className="btn btn-success me-2"
              onClick={() => filterProperties("low")}
            >
              Low Budget
            </button>

            <button
              className="btn btn-warning me-2"
              onClick={() => filterProperties("medium")}
            >
              Medium Budget
            </button>

            <button
              className="btn btn-danger"
              onClick={() => filterProperties("high")}
            >
              Luxury
            </button>

          </div>

          {
            (
              filteredProperties.length > 0
              ? filteredProperties
              : properties
            ).map((property) => (

              <div
                key={property.id}
                className="card p-3 mb-3"
              >

                <h3>{property.name}</h3>

                <p>
                  Location: {property.location}
                </p>

                <p>
                  Price: ₹{property.price}
                </p>

                <button
                  className="btn btn-primary"
                  onClick={async () => {

                    try {

                      const response = await axios.post(
                        "http://127.0.0.1:5000/interested",
                        {
                          user_name: name,
                          email: email,
                          property_name: property.name
                        }
                      );

                      alert(response.data.message);

                    } catch (error) {

                      alert("Request Failed");
                    }
                  }}
                >
                  Interested
                </button>

              </div>
            ))
          }

        </div>

        {/* Admin Dashboard */}
        <div className="card p-4 mb-5 shadow">

          <h2>Admin Dashboard</h2>

          <button
            className="btn btn-info mb-4"
            onClick={getBuyers}
          >
            View Interested Buyers
          </button>

          {
            buyers.map((buyer) => (

              <div
                key={buyer.id}
                className="card p-3 mb-3"
              >

                <h3>{buyer.user_name}</h3>

                <p>Email: {buyer.email}</p>

                <p>
                  Interested Property:
                  {buyer.property_name}
                </p>

              </div>
            ))
          }

        </div>

      </div>
{/* Footer */}
<footer
  className="bg-dark text-white text-center p-4 mt-5"
>

  <h5>
    MyHome Smart Real Estate Platform
  </h5>

  <p>
    Built using React, Flask, MySQL & Bootstrap
  </p>

  <p>
    © 2026 MyHome Project
  </p>

</footer>
```

    </div>
  );
}

export default App;

