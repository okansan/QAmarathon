const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));

const port = 3321;

const cors = require("cors");
app.use(cors());

const { Pool } = require("pg");
const pool = new Pool({
  user: "user_risa_kikuchi", // PostgreSQLのユーザー名に置き換えてください
  host: "localhost",
  database: "db_risa_kikuchi", // PostgreSQLのデータベース名に置き換えてください
  password: "pass", // PostgreSQLのパスワードに置き換えてください
  port: 5432,
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.get("/customer/list", async (req, res) => {
  try {
    const customerData = await pool.query("SELECT * FROM customers");
    res.setHeader('Content-Type','application/json');
    res.send(JSON.stringify(customerData.rows));
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/add-customer", async (req, res) => {
  try {
    const { companyName, industry, contact, location } = req.body;
    const newCustomer = await pool.query(
      "INSERT INTO customers (company_name, industry, contact, location) VALUES ($1, $2, $3, $4) RETURNING *",
      [companyName, industry, contact, location]
    );
    res.json({ success: true, customer: newCustomer.rows[0] });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

app.get("/customer/detail/:customer_id", async (req, res) => {
  try {
    const customerId = req.params.customer_id; // クエリパラメータから customer_id を取得

    const customerData = await pool.query("SELECT * FROM customers WHERE customer_id = $1", [customerId]);
    
    if (customerData.rows.length > 0) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(customerData.rows[0]));
    } else {
      res.status(404).send('Customer not found');
    }

  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.delete("/customer/delete/:customer_id", async (req, res) => {
  try {
    const customerId = req.params.customer_id;

    const result = await pool.query("DELETE FROM customers WHERE customer_id = $1 RETURNING *", [customerId]);

    if (result.rows.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.error(err);
    res.json({ success: false, error: err.message });
  }
});


app.put("/customer/update/:customer_id", async (req, res) => {
  try {
      const customerId = req.params.customer_id;
      const { companyName, industry, contact, location } = req.body;

      const result = await pool.query(
          "UPDATE customers SET company_name = $1, industry = $2, contact = $3, location = $4 WHERE customer_id = $5 RETURNING *",
          [companyName, industry, contact, location, customerId]
      );

      if (result.rows.length > 0) {
          res.json({ success: true });
      } else {
          res.json({ success: false });
      }
  } catch (err) {
      console.error(err);
      res.json({ success: false, error: err.message });
  }
});





app.use(express.static("public"));
