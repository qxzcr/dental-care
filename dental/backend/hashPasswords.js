const bcrypt = require('bcrypt');

const passwords = {
    'anna': 'AdminPass123!',  // For Anna Nowak (admin)
    'jan': 'DoctorPass123!'   // For Jan Kowalski (doctor)
};

for (const [user, password] of Object.entries(passwords)) {
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    console.log(`${user}: ${hashedPassword}`);
}