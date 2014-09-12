var self = require("sdk/self");
var base64 = require("sdk/base64");
const {Ci, Cc} = require("chrome");

let nsX509CertDB = "@mozilla.org/security/x509certdb;1";
let nsIX509Cert = Ci.nsIX509Cert;
let nsIX509CertDB = Ci.nsIX509CertDB;
let certdb = Cc[nsX509CertDB].getService(nsIX509CertDB);

var certificates = self.data.load("certdata.txt");


function isCertificateTrusted(cert) {
  var trusted = false;
  try {
    trusted = certdb.isCertTrusted(cert, nsIX509Cert.CA_CERT, nsIX509CertDB.TRUSTED_SSL);
  } catch (e) {
    // isCertTrusted throws if the cert is not present
  }
  return trusted;
}

function importCertificate(certData) {
  let der = base64.decode(certData);
  let cert = certdb.constructX509(der, der.length);

  if (!isCertificateTrusted(cert)) {
    certdb.addCert(der,'Cu,,','NSS ignores nicknames');
    console.log('certificate added!');
  } else {
    console.log('certificate was already trusted');
  }
}

function removeCertificate(certData) {
  let der = base64.decode(certData);
  let cert = certdb.constructX509(der, der.length);

  if (isCertificateTrusted(cert)) {
    certdb.deleteCertificate(cert);
    console.log('certificate deleted.');
  } else {
    console.log('certificate was not trusted');
  }
}

for (cert of certificates.split('----')) {
  importCertificate(cert.replace(/\s/g,''));
}
