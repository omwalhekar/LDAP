const express = require("express");
const app = express();
const ldap = require("ldapjs");

const client = ldap.createClient({
  url: "ldap://127.0.0.1:10389",
});

app.listen(3000, () => {
  console.log("Server has started on port: 3000");
});

function authenticate(username, password) {
  client.bind(username, password, err => {
    if (err) {
      console.log("Error in bind: ", err);
    } else {
      console.log("success");
      // searchUser();
      // addUser();
      // deleteUser();
      addUserToGroup("cn=Administrators,ou=groups,ou=system");
    }
  });
}

function searchUser() {
  const opts = {
    //put an AND condition as below
    // filter: "(&(cn=Omkar)(sn=Walhekar))",

    //use an OR condition as below
    filter: "(|(uid=2)(sn=Walhekar))",
    scope: "sub",
    attributes: ["sn", "cn"],
  };

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
function addUser() {
  const entry = {
    // cn: "foo",
    sn: "bar",
    // email: ["foo@bar.com", "foo1@bar.com"],
    objectclass: "inetOrgPerson",
  };
  client.add("cn=foo1, ou=users,ou=system", entry, err => {
    if (err) {
      console.log("err in new user" + err);
    } else {
      console.log("user added");
    }
  });
}

function deleteUser() {
  client.del("cn=foo1,ou=users,ou=system", err => {
    if (err) {
      console.log("err in delete user" + err);
    } else {
      console.log("deleted User");
    }
  });
}

function addUserToGroup(groupName) {
  const change = new ldap.Change({
    operation: "add",
    modification: {
      uniqueMember: "cn=Omkar,ou=users,ou=system",
    },
  });

  client.modify(groupName, change, err => {
    if (err) {
      console.log("err in add user in a group" + err);
    } else {
      console.log("Added User in a group");
    }
  });
}
// authenticate("cn=Omkar,ou=users,ou=system", "1");
authenticate("uid=admin,ou=system", "secret");
