import sql from "../../../DB/db.js";
import bcrypt from "bcryptjs";
export const signUp =  (req, res, next) => {
  const { name, email, password, phone, age } = req.body;
  if (!email) {
    res.json({ message: "email is required" });
  }
  sql.execute(
    `select * from users where email = '${email}'`,
    (err, result, field) => {
      if (err) {
        return res.json({ message: "query error", err });
      } else if (result.length) {
          return res.json({ message: "Already there is this email" });
        } else {
          if (!password) {
            return res.json({ message: "Password is required" });
          }
          const hashPassword = bcrypt.hashSync(
            password,
            "$2a$10$IVFSEm85Yzt8iNNRuP.BP."
          );
          sql.execute(
            `INSERT INTO users(name, email, password, phone, age) VALUES ('${name}','${email}','${hashPassword}',${phone},${age})`,
            (insertErr, insertResult, field) => {
              if (insertErr) {
                res.status(400).json({ message: "query insertError", insertErr });
              } else if (insertResult.affectedRows) {
                res.status(201).json({ message: "Done", insertResult });
              }else {
                res.status(400).json({ message: "Something is rong" });
              }
            }
          );
        }
    }
  );
};
export const login = (req, res, next) => {
  const { email, password } = req.body;
  if(!email){
    res.status(400).json({message:"Email is required"})
  }
  if(!password){
    res.status(400).json({message:"Password is required"})
  }
  sql.execute(
    `select * from users where email = '${email}'`,
    (err, result, field) => {
      if (err) {
        res.status(400).json({ message: "Query error", err });
      } else if (result.length) {
        const match =  bcrypt.compareSync(password, result[0].password);
        if (match === true) {
          sql.execute(
            `update users set active = true where id = '${result[0].id}'`,
            (updateErr, updateResult, field) => {
              if (updateErr) {
                res.status(200).json({ message: "Query updateError", updateErr });
              } else if (updateResult.affectedRows) {
                res.status(200).json({ message: "Done", updateResult });
              } else {
                res.status(400).json({ message: "Something is rong" });
              }
            }
          );
        } else {
          res.status(400).json({ message: "This password is rong" });
        }
      } else {
        res.status(404).json({ message: "In-valid user" });
      }
    }
  );
};
export const logout = (req, res, next) => {
  const { id } = req.params;
  sql.execute(`select * from users where id = ${id}`, (err, result, field) => {
    if (err) {
      res.status(400).json({ message: "Query error", err });
    } else if (result.length) {
        if(result[0].active == false){
            res.status(400).json({message:"already this email logedout"})
        }
      sql.execute(
        `update users set active = false where id = ${result[0].id}`,
        (updateErr, updateResult, field) => {
          if (updateErr) {
            res.status(400).json({ message: "Query updateError", updateErr });
          } else if (updateResult.affectedRows) {
            res.status(200).json({ message: "Done", updateResult });
          } else {
            res.status(400).json({ message: "There is something rong" });
          }
        }
      );
    } else {
      res.status(400).json({ message: "In-valid user" });
    }
  });
  console.log(id);
};
