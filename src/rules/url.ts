import isURL from 'validator/lib/isURL'

const protocols = [
    'aaa', 'aaas', 'about', 'acap', 'acct', 'acr', 'adiumxtra', 'afp', 'afs', 'aim', 'apt', 'attachment', 'aw', 'barion', 'beshare', 'bitcoin', 'blob', 'bolo', 'callto', 'cap', 'chrome', 'chrome-extension', 'cid', 'coap', 'coaps', 'com-eventbrite-attendee', 'content', 'crid', 'cvs', 'data', 'dav', 'dict', 'dlna-playcontainer', 'dlna-playsingle', 'dns', 'dntp', 'dtn', 'dvb', 'ed2k', 'example', 'facetime', 'fax', 'feed', 'feedready', 'file', 'filesystem', 'finger', 'fish', 'ftp', 'geo', 'gg', 'git', 'gizmoproject', 'go', 'gopher', 'gtalk', 'h323', 'ham', 'hcp', 'http', 'https', 'iax', 'icap', 'icon', 'im', 'imap', 'info', 'iotdisco', 'ipn', 'ipp', 'ipps', 'irc', 'irc6', 'ircs', 'iris', 'iris.beep', 'iris.lwz', 'iris.xpc', 'iris.xpcs', 'itms', 'jabber', 'jar', 'jms', 'keyparc', 'lastfm', 'ldap', 'ldaps', 'magnet', 'mailserver', 'mailto', 'maps', 'market', 'message', 'mid', 'mms', 'modem', 'ms-help', 'ms-settings', 'ms-settings-airplanemode', 'ms-settings-bluetooth', 'ms-settings-camera', 'ms-settings-cellular', 'ms-settings-cloudstorage', 'ms-settings-emailandaccounts', 'ms-settings-language', 'ms-settings-location', 'ms-settings-lock', 'ms-settings-nfctransactions', 'ms-settings-notifications', 'ms-settings-power', 'ms-settings-privacy', 'ms-settings-proximity', 'ms-settings-screenrotation', 'ms-settings-wifi', 'ms-settings-workplace', 'msnim', 'msrp', 'msrps', 'mtqp', 'mumble', 'mupdate', 'mvn', 'news', 'nfs', 'ni', 'nih', 'nntp', 'notes', 'oid', 'opaquelocktoken', 'pack', 'palm', 'paparazzi', 'pkcs11', 'platform', 'pop', 'pres', 'prospero', 'proxy', 'psyc', 'query', 'redis', 'rediss', 'reload', 'res', 'resource', 'rmi', 'rsync', 'rtmfp', 'rtmp', 'rtsp', 'rtsps', 'rtspu', 'secondlife', 'service', 'session', 'sftp', 'sgn', 'shttp', 'sieve', 'sip', 'sips', 'skype', 'smb', 'sms', 'smtp', 'snews', 'snmp', 'soap.beep', 'soap.beeps', 'soldat', 'spotify', 'ssh', 'steam', 'stun', 'stuns', 'submit', 'svn', 'tag', 'teamspeak', 'tel', 'teliaeid', 'telnet', 'tftp', 'things', 'thismessage', 'tip', 'tn3270', 'turn', 'turns', 'tv', 'udp', 'unreal', 'urn', 'ut2004', 'vemmi', 'ventrilo', 'videotex', 'view-source', 'wais', 'webcal', 'ws', 'wss', 'wtai', 'wyciwyg', 'xcon', 'xcon-userid', 'xfire', 'xmlrpc.beep', 'xmlrpc.beeps', 'xmpp', 'xri', 'ymsgr', 'z39.50', 'z39.50r', 'z39.50s',
]

const validate = (attribute: string, value: any, [requireProtocol = true]: any[], validator: any): boolean => {
    if (typeof value !== 'string') {
        return false
    }

    const options: any = {
        protocols,
        require_host: true,
        require_protocol: [true, 1, '1'].indexOf(requireProtocol) > -1,
    }

    return isURL(value, options)
}

export default validate
