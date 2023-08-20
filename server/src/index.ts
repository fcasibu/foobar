import app from './app';

const PORT = Number(process.env.PORT);

app.listen(PORT, 'localhost', () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
