module.exports = {
    emailRegex: async (value) => {
        const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        const isValidEmail = emailRegex.test(value);
        return isValidEmail;
    },
}