var self = require("sdk/self");
var base64 = require("sdk/base64");
const {Ci, Cc} = require("chrome");

let nsX509CertDB = "@mozilla.org/security/x509certdb;1";
let nsIX509Cert = Ci.nsIX509Cert;
let nsIX509CertDB = Ci.nsIX509CertDB;
let certdb = Cc[nsX509CertDB].getService(nsIX509CertDB);

var certificates = self.data.load("certdata.txt");

function importCertificate(certData) {
  let der = base64.decode(certData);
  certdb.addCert(der,'Cu,,','NSS ignores nicknames');
  console.log('certificate added!');
}

for (cert of certificates.split('----')) {
  importCertificate(cert.replace(/\s/g,''));
}
