// import React from 'react';
// import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// // Dummy data
// const salesData = [
//   { month: 'Jan', sales: 65, units: 140 },
//   { month: 'Feb', sales: 59, units: 120 },
//   { month: 'Mar', sales: 80, units: 150 },
//   { month: 'Apr', sales: 81, units: 160 },
//   { month: 'May', sales: 56, units: 110 },
// ];

// const inventoryData = [
//   { id: 1, title: 'Thriller', artist: 'Michael Jackson', stock: 15, price: 29.99 },
//   { id: 2, title: 'Rumours', artist: 'Fleetwood Mac', stock: 8, price: 24.99 },
//   { id: 3, title: 'The Dark Side of the Moon', artist: 'Pink Floyd', stock: 12, price: 34.99 },
//   { id: 4, title: 'Back in Black', artist: 'AC/DC', stock: 5, price: 27.99 },
// ];

// const appStyles = {
//   display: 'flex',
//   minHeight: '100vh',
//   backgroundColor: '#f5f5f5',
// };

// const sidebarStyles = {
//   width: '200px',
//   backgroundColor: '#2c3e50',
//   color: 'white',
//   padding: '20px',
// };

// const mainContentStyles = {
//   flexGrow: 1,
//   padding: '20px',
// };

// const cardStyles = {
//   backgroundColor: 'white',
//   borderRadius: '8px',
//   padding: '20px',
//   marginBottom: '20px',
//   boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
// };

// const SummaryCards = () => {
//   const totalSales = salesData.reduce((sum, month) => sum + month.sales, 0);
//   const totalStock = inventoryData.reduce((sum, item) => sum + item.stock, 0);

//   return (
//     <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
//       <div style={{ ...cardStyles, flex: 1 }}>
//         <h3 style={{ margin: 0 }}>Total Sales</h3>
//         <p style={{ fontSize: '24px', fontWeight: 'bold' }}>${totalSales}k</p>
//       </div>
//       <div style={{ ...cardStyles, flex: 1 }}>
//         <h3 style={{ margin: 0 }}>Total Inventory</h3>
//         <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalStock} units</p>
//       </div>
//     </div>
//   );
// };

// const SalesChart = () => (
//   <div style={cardStyles}>
//     <h2 style={{ marginTop: 0 }}>Sales Overview</h2>
//     <div style={{ width: '100%', height: 400 }}>
//       <ResponsiveContainer>
//         <BarChart data={salesData}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="month" />
//           <YAxis />
//           <Tooltip />
//           <Bar dataKey="sales" fill="#8884d8" />
//           <Bar dataKey="units" fill="#82ca9d" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   </div>
// );

// const InventoryList = () => (
//   <div style={cardStyles}>
//     <h2 style={{ marginTop: 0 }}>Current Inventory</h2>
//     <div style={{ overflowX: 'auto' }}>
//       <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//         <thead>
//           <tr style={{ backgroundColor: '#f8f9fa' }}>
//             <th style={{ textAlign: 'left', padding: '10px' }}>Album</th>
//             <th style={{ textAlign: 'left', padding: '10px' }}>Artist</th>
//             <th style={{ textAlign: 'left', padding: '10px' }}>Stock</th>
//             <th style={{ textAlign: 'left', padding: '10px' }}>Price</th>
//           </tr>
//         </thead>
//         <tbody>
//           {inventoryData.map((album) => (
//             <tr key={album.id} style={{ borderTop: '1px solid #eee' }}>
//               <td style={{ padding: '10px' }}>{album.title}</td>
//               <td style={{ padding: '10px' }}>{album.artist}</td>
//               <td style={{ padding: '10px' }}>{album.stock}</td>
//               <td style={{ padding: '10px' }}>${album.price}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   </div>
// );

// const Dashboard = () => (
//   <div>
//     <h1 style={{ marginTop: 0 }}>Dashboard Overview</h1>
//     <SummaryCards />
//     <SalesChart />
//   </div>
// );

// const Sales = () => (
//   <div>
//     <h1 style={{ marginTop: 0 }}>Sales Analytics</h1>
//     <SalesChart />
//   </div>
// );

// const Inventory = () => (
//   <div>
//     <h1 style={{ marginTop: 0 }}>Inventory Management</h1>
//     <InventoryList />
//   </div>
// );

// const App = () => (
//   <Router>
//     <div style={appStyles}>
//       <div style={sidebarStyles}>
//         <h2 style={{ marginTop: 0 }}>Music Store</h2>
//         <nav>
//           <ul style={{ listStyle: 'none', padding: 0 }}>
//             <li style={{ margin: '15px 0' }}>
//               <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
//             </li>
//             <li style={{ margin: '15px 0' }}>
//               <Link to="/sales" style={{ color: 'white', textDecoration: 'none' }}>Sales</Link>
//             </li>
//             <li style={{ margin: '15px 0' }}>
//               <Link to="/inventory" style={{ color: 'white', textDecoration: 'none' }}>Inventory</Link>
//             </li>
//           </ul>
//         </nav>
//       </div>

//       <div style={mainContentStyles}>
//         <Routes>
//           <Route path="/" element={<Dashboard />} />
//           <Route path="/sales" element={<Sales />} />
//           <Route path="/inventory" element={<Inventory />} />
//         </Routes>
//       </div>
//     </div>
//   </Router>
// );

// export default App;














import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Chat from './Chat';

// Dummy data
const salesData = [
  { month: 'Jan', sales: 65, units: 140 },
  { month: 'Feb', sales: 59, units: 120 },
  { month: 'Mar', sales: 80, units: 150 },
  { month: 'Apr', sales: 81, units: 160 },
  { month: 'May', sales: 56, units: 110 },
];

const inventoryData = [
  { id: 1, title: 'Thriller', artist: 'Michael Jackson', stock: 15, price: 29.99 },
  { id: 2, title: 'Rumours', artist: 'Fleetwood Mac', stock: 8, price: 24.99 },
  { id: 3, title: 'The Dark Side of the Moon', artist: 'Pink Floyd', stock: 12, price: 34.99 },
  { id: 4, title: 'Back in Black', artist: 'AC/DC', stock: 5, price: 27.99 },
];

// Styles
const appStyles = {
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#f5f5f5',
};

const sidebarStyles = {
  width: '200px',
  backgroundColor: '#2c3e50',
  color: 'white',
  padding: '20px',
};

const mainContentStyles = {
  flexGrow: 1,
  padding: '20px',
};

const navbarStyles = {
  backgroundColor: '#2c3e50',
  color: 'white',
  padding: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
  borderRadius: '8px',
};

const cardStyles = {
  backgroundColor: 'white',
  borderRadius: '8px',
  padding: '20px',
  marginBottom: '20px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

// Components
const Navbar = () => {
  const location = useLocation();
  const pageTitles = {
    '/': 'Dashboard Overview',
    '/sales': 'Sales Analytics',
    '/inventory': 'Inventory Management'
  };

  return (
    <div style={navbarStyles}>
      <h2 style={{ margin: 0 }}>{pageTitles[location.pathname]}</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🔔</span>
          <span>Notifications</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: '#3498db',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            👤
          </div>
          <span>Admin User</span>
        </div>
      </div>
    </div>
  );
};

const SummaryCards = () => {
  const totalSales = salesData.reduce((sum, month) => sum + month.sales, 0);
  const totalStock = inventoryData.reduce((sum, item) => sum + item.stock, 0);

  return (
    <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
      <div style={{ ...cardStyles, flex: 1 }}>
        <h3 style={{ margin: 0 }}>Total Sales</h3>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>${totalSales}k</p>
      </div>
      <div style={{ ...cardStyles, flex: 1 }}>
        <h3 style={{ margin: 0 }}>Total Inventory</h3>
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalStock} units</p>
      </div>
    </div>
  );
};

const SalesChart = () => (
  <div style={cardStyles}>
    <h2 style={{ marginTop: 0 }}>Sales Overview</h2>
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <BarChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sales" fill="#8884d8" />
          <Bar dataKey="units" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const InventoryList = () => (
  <div style={cardStyles}>
    <h2 style={{ marginTop: 0 }}>Current Inventory</h2>
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f8f9fa' }}>
            <th style={{ textAlign: 'left', padding: '10px' }}>Album</th>
            <th style={{ textAlign: 'left', padding: '10px' }}>Artist</th>
            <th style={{ textAlign: 'left', padding: '10px' }}>Stock</th>
            <th style={{ textAlign: 'left', padding: '10px' }}>Price</th>
          </tr>
        </thead>
        <tbody>
          {inventoryData.map((album) => (
            <tr key={album.id} style={{ borderTop: '1px solid #eee' }}>
              <td style={{ padding: '10px' }}>{album.title}</td>
              <td style={{ padding: '10px' }}>{album.artist}</td>
              <td style={{ padding: '10px' }}>{album.stock}</td>
              <td style={{ padding: '10px' }}>${album.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Pages
const Dashboard = () => (
  <div>
    <SummaryCards />
    <SalesChart />
  </div>
);

const Sales = () => (
  <div>
    <SalesChart />
  </div>
);

const Inventory = () => (
  <div>
    <InventoryList />
  </div>
);

// Main App Component
const App = () => (
  <Router>
    <div style={appStyles}>
      <div style={sidebarStyles}>
        <h2 style={{ marginTop: 0 }}>Music Store</h2>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ margin: '15px 0' }}>
              <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
            </li>
            <li style={{ margin: '15px 0' }}>
              <Link to="/sales" style={{ color: 'white', textDecoration: 'none' }}>Sales</Link>
            </li>
            <li style={{ margin: '15px 0' }}>
              <Link to="/inventory" style={{ color: 'white', textDecoration: 'none' }}>Inventory</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div style={mainContentStyles}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
        <Chat />
      </div>
    </div>
  </Router>
);

export default App;