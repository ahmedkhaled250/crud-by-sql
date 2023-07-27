import sql from "../../../DB/db.js";
export const addProdect = (req, res, next) => {
  const { title, description, price, userId } = req.body;
  sql.execute(`SELECT 8 FROM users Where id = ${userId}`, (err, result) => {
    if (err) {
      return res.status(400).json({ message: "Query error", err });
    } else if (!result.length) {
      return res.status(400).json({ message: "In-valid user" });
    }
  });
  sql.execute(
    `INSERT INTO products (title ,description,price,userId) VALUES ('${title}','${description}',${price},${userId})`,
    (err, result) => {
      if (err) {
        return res.status(400).json({ message: "Query error", err });
      } else if (result.affectedRows == 1) {
        return res.status(201).json({ message: "Done", result });
      } else {
        return res.status(404).json({ message: "There something rong" });
      }
    }
  );
};
export const getProductById = (req, res, next) => {
  const { id } = req.params;
  sql.execute(
    `select u.id as u_id , u.name , u.email , p.id as p_id , p.title , p.description, p.price from products as p  inner join users as u on u.id = p.userId  where p.id = ${id}`,
    (err, result) => {
      if (err) {
        return res.status(400).json({ message: "Query error", err });
      } else if (result.length) {
        return res.status(200).json({ message: "Done", result });
      } else {
        return res.status(404).json({ message: "In-valid product" });
      }
    }
  );
};
export const getProductsWithSpecificPrice = (req, res, next) => {
  const { price } = req.body;
  sql.execute(
    `select u.id as u_id , u.name , u.email , p.id as p_id , p.title , p.description, p.price from products as p  inner join users as u on u.id = p.userId  where p.price > ${price}`,
    (err, result) => {
      if (err) {
        return res.status(400).json({ message: "Query error", err });
      } else if (result.length) {
        return res.status(200).json({ message: "Done", result });
      } else {
        return res.status(404).json({ message: "In-valid product" });
      }
    }
  );
};
export const products = (req, res, next) => {
  sql.execute(
    `select u.id as u_id , u.name , u.email , p.id as p_id , p.title , p.description, p.price from products as p inner join users as u on u.id = p.userId`,
    (err, result) => {
      if (err) {
        return res.status(400).json({ message: "Query error", err });
      } else if (result.length) {
        return res.status(200).json({ message: "Done", result });
      } else {
        return res.status(404).json({ message: "In-valid products" });
      }
    }
  );
};
export const updateProduct = (req, res, next) => {
  const { id } = req.params;
  const { title, description, price } = req.body;

  sql.execute(`select * from products where id = ${id}`, (err, result) => {
    if (err) {
      return res.status(400).json({ message: "Query error", err });
    } else if (result.length) {
      let finalTitle;
      let finalDescription;
      let finalPrice;
      !title ? (finalTitle = result[0].title) : (finalTitle = title);
      !description
        ? (finalDescription = result[0].description)
        : (finalDescription = description);
      !price ? (finalPrice = result[0].price) : (finalPrice = price);
      sql.execute(
        `update products set title = '${finalTitle}',description = '${finalDescription}',price = ${finalPrice} where id = ${id}`,
        (err, result) => {
          if (err) {
            return res.status(400).json({ message: "Query error", err });
          } else if (result.affectedRows == 1) {
            return res.status(200).json({ message: "Done", result });
          } else {
            return res.status(400).json({ message: "There is simething rong" });
          }
        }
      );
    } else {
      return res.status(400).json({ message: "In-valid product by this id" });
    }
  });
};
export const deleteProduct = (req, res, next) => {
  const { id } = req.params;
  sql.execute(`delete from products where id = ${id}`, (err, result) => {
    if (err) {
      return res.status(400).json({ message: "Query error", err });
    } else if (result.affectedRows) {
      return res.status(200).json({ message: "Done", result });
    } else {
      return res.status(400).json({ message: "In-valid product" });
    }
  });
};
