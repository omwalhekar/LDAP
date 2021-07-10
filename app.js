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
      // addUserToGroup("cn=Administrators,ou=groups,ou=system");
      // deleteUserFromGroup("cn=Administrators,ou=groups,ou=system");
      // updateUser("cn=Omkar,ou=users,ou=system");
      // compare("cn=mishra,ou=users,ou=system");
      modifyDN("cn=mishra,ou=users,ou=system");
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
      uniqueMember: "cn=ravi,ou=users,ou=system",
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

function deleteUserFromGroup(groupName) {
  const change = new ldap.Change({
    operation: "delete",
    modification: {
      uniqueMember: "cn=ravi,ou=users,ou=system",
    },
  });

  client.modify(groupName, change, err => {
    if (err) {
      console.log("err in delete user from a group" + err);
    } else {
      console.log("deleted User in a group");
    }
  });
}

function updateUser(dn) {
  const change = new ldap.Change({
    //user 'add' as operation for adding a new attribute
    //for updating existing attribute
    operation: "replace",
    modification: {
      displayName: "347",
    },
  });

  client.modify(dn, change, err => {
    if (err) {
      console.log("err in update user " + err);
    } else {
      console.log("add update users");
    }
  });
}

function compare(dn) {
  client.compare(dn, "sn", "sirr", (err, matched) => {
    if (err) {
      console.log("err in compare user " + err);
    } else {
      //returns true if the user exists
      //returns false if no user is found
      console.log("result: " + matched);
    }
  });
}

function modifyDN(dn) {
  client.modifyDN(dn, "cn=bar", err => {
    if (err) {
      console.log("err in modifyDN " + err);
    } else {
      console.log("DN changed");
    }
  });
}

//authenticates the user that is going to access the LDAP
authenticate("cn=Omkar,ou=users,ou=system", "1");
// authenticate("uid=admin,ou=system", "secret");
