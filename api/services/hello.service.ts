class HelloService {
    loggedIn (req) {
        return {
            name: req.name,
            email: req.email
        };
    }
}

export default new HelloService();
