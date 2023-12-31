const express = require("express");
const app = express();
const port = 8080;
app.use(express.json());
const tally = require("./model/tally");
const connect = require("./db/connector")

app.get("/totalRecovered", async (req, res) => {
  try {
    const data = await tally.aggregate([
      {
        $group: {
          _id: "total",
          recovered: {
            $sum: "$recovered",
          },
        },
      },
    ]);
    res.status(200).json({ data: data[0] });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
});

// getting total active covid patients
app.get("/totalActive", async (req, res) => {
  try {
    const data = await tally.aggregate([
      {
        $group: {
          _id: "total",
          active: {
            $sum: {
              $subtract: ["$infected", "$recovered"],
            },
          },
        },
      },
    ]);
    res.status(200).json({ data: data[0] });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
});
// getting total deaths count
app.get("/totalDeath", async (req, res) => {
  try {
    const data = await connection.aggregate([
      {
        $group: {
          _id: "total",
          death: {
            $sum: "$death",
          },
        },
      },
    ]);
    res.status(200).json({ data: data[0] });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
});

//  getting hotspot states
app.get("/hotspotStates", async (req, res) => {
  try {
    const data = await connection.aggregate([
      {
        $match: {
          $expr: {
            $gt: [
              {
                $round: [
                  {
                    $divide: [
                      {
                        $subtract: ["$infected", "$recovered"],
                      },
                      "$infected",
                    ],
                  },
                  5,
                ],
              },
              0.1,
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
          state: 1,
          rate: {
            $round: [
              {
                $divide: [
                  {
                    $subtract: ["$infected", "$recovered"],
                  },
                  "$infected",
                ],
              },
              5,
            ],
          },
        },
      },
    ]);

    res.json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
});

// gettings healthy states
app.get("/healthyStates", async (req, res) => {
  try {
    const data = await tally.aggregate([
      {
        $match: {
          $expr: {
            $lt: [
              {
                $round: [
                  {
                    $divide: ["$death", "$infected"],
                  },
                  5,
                ],
              },
              0.005,
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
          state: 1,
          mortality: {
            $round: [
              {
                $divide: ["$death", "$infected"],
              },
              5,
            ],
          },
        },
      },
    ]);

    res.json({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failure",
      message: error.message,
    });
  }
});

app.listen(port, () => {
  connect(); //db connection
  console.log(`App listening on port ${port}!`)
});

module.exports = app;
