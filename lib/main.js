var self = require("sdk/self");
var base64 = require("sdk/base64");
const {Ci, Cc} = require("chrome");

let nsX509CertDB = "@mozilla.org/security/x509certdb;1";
let nsIX509Cert = Ci.nsIX509Cert;
let nsIX509CertDB = Ci.nsIX509CertDB;
let certdb = Cc[nsX509CertDB].getService(nsIX509CertDB);

if (typeof(String.prototype.trim) === "undefined")
{
  String.prototype.trim = function() {
    if (this.length > 0) {
      return String(this).replace(/^\s+|\s+$/g, '');
    } else {
      return '';
    }
  };
}


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

function processFile(filename, func) {
  try {
    var trust = self.data.load(filename);
    for (f of trust.split(/\r\n|\r|\n/g)) {
      certFile = f.trim();
      if (certFile.length > 0) {
        fileData = self.data.load(certFile);
        console.log('processing '+certFile);
        if (fileData.length > 0) {

          let pretty = fileData.split('-----')[2];
          if (pretty.length > 0) {
            let data = pretty.replace(/\s/g, '');
            if (data.length > 0) {
              func(data);
            }
          }
        } else {
          console.log('certificate file '+certFile+' appears to be empty');
        }
      }
    }
  } catch (e) {
    console.log('there was a problem loading the contents of '+filename);
  }
}

processFile("trust.txt", importCertificate);
processFile("distrust.txt", removeCertificate);
