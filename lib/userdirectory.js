var WorkOS = require('@workos-inc/node').WorkOS;


function WorkOSUserDirectory(db) {
  // reads WORKOS_API_KEY env var by default
  console.log('%%% NEW WORK OS %$$');
  console.log(process.env.WORKOS_API_KEY)
  this._client = new WorkOS(process.env.WORKOS_API_KEY);
}

WorkOSUserDirectory.prototype.read = function(id, cb) {
  console.log('WORKOS READ: ' + id)
  console.log(this._client);
  console.log(this._client.userManagement);
  
  this._client.userManagement.getUser(id)
    .then(function(obj) {
      console.log('GOT USER')
      console.log(obj);
      
      // wip, now working
      
      var user = {}
      user.id = obj.id;
      if (obj.firstName || obj.lastName) {
        user.name = {
          givenName: obj.fistName,
          familyName: obj.familyName
        };
      }
      user.emails = [
        { value: obj.email, verified: obj.emailVerified }
      ]
      
      return cb(null, user);
    })
    .catch(function(error) {
      console.log('ERR USER')
      console.log(error);
      
      if (error.code == 'entity_not_found') {
        return cb(null, undefined);
      }
      
      
      return cb(error);
    });
}

WorkOSUserDirectory.prototype.create = function(user, cb) {
  console.log('WORKOS CREATE');
  console.log(user);
  
  var obj = {}
    , email;
  
  // NOTE: email is required
  
  if (user.emails && user.emails.length > 0) {
    // TODO: find primary, or default to 0
    email = user.emails[0];
    obj.email = email.value;
  }
  
  
  if (user.name) {
    if (user.name.givenName) { obj.firstName = user.name.givenName; }
    if (user.name.familyName) { obj.lastName = user.name.familyName; }
  }
  
  console.log(obj);
  
  
  this._client.userManagement.createUser(obj)
    .then(function(obj) {
      console.log('GOT USER')
      console.log(obj);
      
      var user = {}
      user.id = obj.id;
      if (obj.firstName || obj.lastName) {
        user.name = {
          givenName: obj.fistName,
          familyName: obj.familyName
        };
      }
      user.emails = [
        { value: obj.email, verified: obj.emailVerified }
      ]
      
      return cb(null, user);
    })
    .catch(function(error) {
      console.log('ERR USER')
      console.log(error);
      
      return cb(error);
    });
}

module.exports = WorkOSUserDirectory;
