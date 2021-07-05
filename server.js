const mongoose = require('mongoose');
const dotenv = require('dotenv');
const port = process.env.PORT || 4250



dotenv.config({ path: './config.env' });
const app = require('./app');

console.log(process.env.PORT)

let DB = process.env.DATABASE
console.log(DB)

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
    .then(() => console.log('DB connection successful!'))
    .catch(error => console.log(error))


const server = app.listen(port, () => {
    console.log(`app is running on port ${port}`)
})
