import mySql2 from "mysql2"
const sql =mySql2.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'study'
})
export default sql