"use strict";

function isAdminByUsername(username) {
  return username.startsWith("admin_") ?? false;
}

module.exports = { isAdminByUsername: isAdminByUsername }