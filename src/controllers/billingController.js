import db from "../config/db.js";
 
// ✅ Get all billing records

export const getAllBillings = (req, res, next) => {

  const sql = "SELECT * FROM billing";
 
  db.query(sql, (err, result) => {

    if (err) {

      console.error("Error fetching billing records:", err);

      return next(err);

    }
 
    res.status(200).json({

      success: true,

      message: "All billing records retrieved successfully",

      data: result,

    });

  });

};
 
// ✅ Get billing record by ID

export const getBillingById = (req, res, next) => {

  const { id } = req.params;

  const sql = "SELECT * FROM billing WHERE billing_id = ?";
 
  db.query(sql, [id], (err, result) => {

    if (err) {

      console.error("Error fetching billing by ID:", err);

      return next(err);

    }
 
    if (result.length === 0) {

      return res.status(404).json({

        success: false,

        message: "Billing record not found",

      });

    }
 
    res.status(200).json({

      success: true,

      message: "Billing record retrieved successfully",

      data: result[0],

    });

  });

};
 
// ✅ Get billing records by patient ID

export const getBillingsByPatientId = (req, res, next) => {

  const { patientId } = req.params;

  const sql = "SELECT * FROM billing WHERE patient_id = ?";
 
  db.query(sql, [patientId], (err, result) => {

    if (err) {

      console.error("Error fetching billing by patient ID:", err);

      return next(err);

    }
 
    res.status(200).json({

      success: true,

      message: "Billing records for patient retrieved successfully",

      data: result,

    });

  });

};
 
// ✅ Get billing records by date (YYYY-MM-DD)

export const getBillingsByDate = (req, res, next) => {

  const { date } = req.params;

  const sql = "SELECT * FROM billing WHERE DATE(billing_date) = ?";
 
  db.query(sql, [date], (err, result) => {

    if (err) {

      console.error("Error fetching billing by date:", err);

      return next(err);

    }
 
    res.status(200).json({

      success: true,

      message: "Billing records for the given date retrieved successfully",

      data: result,

    });

  });

};
 
// ✅ Get billing records by payment status (paid/unpaid/pending)

export const getBillingsByStatus = (req, res, next) => {

  const { status } = req.params;

  const sql = "SELECT * FROM billing WHERE payment_status = ?";
 
  db.query(sql, [status], (err, result) => {

    if (err) {

      console.error("Error fetching billing by status:", err);

      return next(err);

    }
 
    res.status(200).json({

      success: true,

      message: `Billing records with status '${status}' retrieved successfully`,

      data: result,

    });

  });

};

 