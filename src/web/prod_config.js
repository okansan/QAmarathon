const fs = require('fs');

module.exports = {
  production: true,
  sshConfig: {
    host: 'dev.marathon.rplearn.net',
    port: 22, // 本番環境のSSHポート
    user: 'risa_kikuchi',
    privateKey: fs.readFileSync('/home/risa_kikuchi/.ssh/id_ed25519', 'utf8'),
  },
  deployScriptPath: '/app/deploy_prod.sh', // 本番環境のデプロイスクリプトのパス
  
};
