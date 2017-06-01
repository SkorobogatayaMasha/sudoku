const Promise = require('bluebird');


module.exports = (userRepository, errors) => {
    return { login: login, register: register };

    function login(data) {
        return new Promise((resolve, reject) => {
            userRepository
                .findOne({ where: { email: data.email }, attributes: ['id', 'password'] })
                .then(user => {
                    if (!user || user.password !== data.password) {
                        reject(errors.wrongCredentials);
                        return;
                    }
                    resolve(user.id);
                })
                .catch(reject);
        });
    }


    function register(data) {
        return new Promise((resolve, reject) => {
            const user = {
                email: data.email,
                password: data.password,
                fullname: data.firstname + data.lastname
            };

            return Promise.all([userRepository.create(user)])
                .then(() => resolve({success: true}))
                .catch(reject);
        });
    }
};