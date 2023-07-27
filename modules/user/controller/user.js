import sql from "../../../DB/db.js";
import bcrypt from "bcryptjs";
export const updateUser = (req, res, next) => {
  const { id } = req.params;
  const { name, email, age, phone } = req.body;
  sql.execute(`select * from users where id = ${id}`, (err, result, field) => {
    if (err) {
      return res.status(400).json({ message: "Query error" });
    } else if (result.length) {
      if (result[0].active == false) {
        return res
          .status(400)
          .json({ message: "You've to login for updating the user" });
      }
      let finalName;
      name ? (finalName = name) : (finalName = result[0].name);
      let finalAge;
      age ? (finalAge = age) : (finalAge = result[0].age);
      let finalPhone;
      phone ? (finalPhone = phone) : (finalPhone = result[0].phone);
      let finalEmail;
      if (email) {
        finalEmail = email;
        sql.execute(
          `select email from users where email = '${email}'`,
          (selectErr, selectResult, Field) => {
            if (selectErr) {
              return res
                .status(400)
                .json({ message: "Query error", selectErr });
            } else if (selectResult.length) {
              return res
                .status(400)
                .json({ message: "Already there is this email" });
            }
          }
        );
      } else {
        finalEmail = result[0].email;
      }
      sql.execute(
        `update users set name = '${finalName}', email = '${finalEmail}', age = ${finalAge}, phone = ${finalPhone} where id = ${result[0].id}`,
        (updateErr, updateResult, field) => {
          if (updateErr) {
            return res.status(400).json({ message: "Query error", updateErr });
          } else if (updateResult.affectedRows == 1) {
            return res.status(200).json({ message: "Done", updateResult });
          } else {
            return res.status(400).json({ message: "There is something rong" });
          }
        }
      );
    } else {
      return res.status(404).json({ message: "In-valid user" });
    }
  });
};
export const updatePassword = (req, res, next) => {
  const { email, oldPassword, password } = req.body;
  if (!email) {
    res.status(400).json({ message: "Email is required" });
  }
  if (!password) {
    res.status(400).json({ message: "Password is required" });
  }
  if (!oldPassword) {
    res.status(400).json({ message: "Old password is required" });
  }
  sql.execute(
    `select * from users where email = '${email}'`,
    (err, result, field) => {
      if (err) {
        res.status(400).json({ message: "Query error", err });
      } else if (result.length) {
        if (result[0].active == false) {
          res
            .status(400)
            .json({ message: "You've to login to update the password" });
        }
        const match = bcrypt.compareSync(oldPassword, result[0].password);
        if (match === true) {
          const hash = bcrypt.hashSync(
            password,
            "$2a$10$IVFSEm85Yzt8iNNRuP.BP."
          );
          sql.execute(
            `update users set password = '${hash}' where id = '${result[0].id}'`,
            (updateErr, updateResult, field) => {
              if (updateErr) {
                res
                  .status(200)
                  .json({ message: "Query update Error", updateErr });
              } else if (updateResult.affectedRows) {
                res.status(200).json({ message: "Done", updateResult });
              } else {
                res.status(400).json({ message: "There is something rong" });
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
export const deleteUser = (req, res, next) => {
  const { id } = req.params;
  sql.execute(`select * from users where id = ${id}`, (err, result, field) => {
    if (err) {
      return res.status(400).json({ message: "Query error", err });
    } else if (result.length) {
      if (result[0].active == false) {
        return res
          .status(400)
          .json({ message: "You've to login for deleting your profile" });
      }
      sql.execute(
        `delete from users where  id = ${result[0].id}`,
        (deleteErr, deleteResult, field) => {
          if (deleteErr) {
            return res.status(400).json({ message: "Query error", deleteErr });
          } else if (deleteResult.length) {
            return res.status(200).json({ message: "Done", result });
          } else {
            return res.status(400).json({ message: "There is something rong" });
          }
        }
      );
    } else {
      return res.status(404).json({ message: "In-valid user" });
    }
  });
};
export const allUsers = (req, res, next) => {
  sql.execute("select * from users", (err, result, field) => {
    if (err) {
      return res.json({ message: "err in sql", err });
    } else if (result) {
      return res.json({ message: "Done", result });
    }
  });
};
export const getUserById = (req, res, next) => {
  const { id } = req.params;
  sql.execute(`select * from users where id = ${id}`, (err, result, field) => {
    if (err) {
      return res.status(400).json({ message: "Query error" });
    } else if (result.length) {
      return res.status(200).json({ message: "Done", result });
    } else {
      return res.status(404).json({ message: "In-valid user" });
    }
  });
};
export const searshByName = (req, res, next) => {
  const { name } = req.body;
  sql.execute(
    `select * from users where name like '%${name}%'`,
    (err, result) => {
      if (err) {
        return res.status(400).json({ message: "Query error", err });
      } else if (result.length) {
        return res.status(200).json({ message: "Done", result });
      } else {
        return res.status(400).json({ message: "In-valid users" });
      }
    }
  );
};
export const getSpecificAge = (req, res, next) => {
  const { startAge, endAge } = req.body;
  sql.execute(
    `select * from users where age < ${endAge} and age > ${startAge}`,
    (err, result) => {
      if (err) {
        return res.status(400).json({ message: "Query error", err });
      } else if (result.length) {
        return res.status(200).json({ message: "Done", result });
      } else {
        return res.status(400).json({ message: "In-valid users" });
      }
    }
  );
};
