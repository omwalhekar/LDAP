const express = require("express");
const app = express();
const ldap = require("ldapjs");

app.listen(3000, () => {
  console.log("Server has started on port: 3000");
});

function authenticate(username, password) {
  const client = ldap.createClient({
    url: "ldap://127.0.0.1:10389",
  });

  client.bind(username, password, err => {
    if (err) {
      console.log(err.lde_message);
    } else {
      console.log("success");
    }
  });
}

authenticate("cn=Omkar,ou=users,ou=system", "1");
