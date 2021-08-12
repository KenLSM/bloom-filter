import express from 'express';
import morgan from 'morgan';

const PORT = 5001;
const app = express();
app.use(morgan('combined'));

app.use('q/:msg', (req, res) => {
    console.log('asd');
    return res.json({ result: 'yes' })
})
app.listen(PORT);

console.log('Ok! Listening on:', PORT)