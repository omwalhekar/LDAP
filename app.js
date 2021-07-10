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
  const opts = {
    //put an AND condition as below
    // filter: "(&(cn=Omkar)(sn=Walhekar))",

    //use an OR condition as below
    filter: "(|(uid=2)(sn=Walhekar))",
    scope: "sub",
    attributes: ["sn", "cn"],
  };

  client.bind(username, password, err => {
    if (err) {
      console.log("Error in bind: ", err);
    } else {
      client.search("ou=users,ou=system", opts, (err, res) => {
        if (err) {
          console.log("Error in search: ", err);
        } else {
          res.on("searchRequest", searchRequest => {
            console.log("searchRequest: ", searchRequest.messageID);
          });
          res.on("searchEntry", entry => {
            console.log("entry: " + JSON.stringify(entry.object));
          });
          res.on("searchReference", referral => {
            console.log("referral: " + referral.uris.join());
          });
          res.on("error", err => {
            console.error("error: " + err.message);
          });
          res.on("end", result => {
            console.log("status: " + result.status);
          });
        }
      });
    }
  });
}

authenticate("cn=Omkar,ou=users,ou=system", "1");
