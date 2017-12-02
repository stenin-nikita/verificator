import * as types from './types'

const DEPENDENT_RULES = [
    'required_with', 'required_with_all', 'required_without',
    'required_without_all', 'required_if', 'required_unless',
    'confirmed', 'same', 'different', 'before', 'after',
    'before_or_equal', 'after_or_equal',
]

const DEFAULT_LOCALE = {
    messages: {},
    attributes: {},
}

const REGEXP_IS_UINT = /^(?:0|[1-9]\d*)$/

const URL_PROTOCOLS = [
    'aaa', 'aaas', 'about', 'acap', 'acct', 'acr', 'adiumxtra', 'afp', 'afs', 'aim', 'apt', 'attachment', 'aw', 'barion', 'beshare', 'bitcoin', 'blob', 'bolo', 'callto', 'cap', 'chrome', 'chrome-extension', 'cid', 'coap', 'coaps', 'com-eventbrite-attendee', 'content', 'crid', 'cvs', 'data', 'dav', 'dict', 'dlna-playcontainer', 'dlna-playsingle', 'dns', 'dntp', 'dtn', 'dvb', 'ed2k', 'example', 'facetime', 'fax', 'feed', 'feedready', 'file', 'filesystem', 'finger', 'fish', 'ftp', 'geo', 'gg', 'git', 'gizmoproject', 'go', 'gopher', 'gtalk', 'h323', 'ham', 'hcp', 'http', 'https', 'iax', 'icap', 'icon', 'im', 'imap', 'info', 'iotdisco', 'ipn', 'ipp', 'ipps', 'irc', 'irc6', 'ircs', 'iris', 'iris.beep', 'iris.lwz', 'iris.xpc', 'iris.xpcs', 'itms', 'jabber', 'jar', 'jms', 'keyparc', 'lastfm', 'ldap', 'ldaps', 'magnet', 'mailserver', 'mailto', 'maps', 'market', 'message', 'mid', 'mms', 'modem', 'ms-help', 'ms-settings', 'ms-settings-airplanemode', 'ms-settings-bluetooth', 'ms-settings-camera', 'ms-settings-cellular', 'ms-settings-cloudstorage', 'ms-settings-emailandaccounts', 'ms-settings-language', 'ms-settings-location', 'ms-settings-lock', 'ms-settings-nfctransactions', 'ms-settings-notifications', 'ms-settings-power', 'ms-settings-privacy', 'ms-settings-proximity', 'ms-settings-screenrotation', 'ms-settings-wifi', 'ms-settings-workplace', 'msnim', 'msrp', 'msrps', 'mtqp', 'mumble', 'mupdate', 'mvn', 'news', 'nfs', 'ni', 'nih', 'nntp', 'notes', 'oid', 'opaquelocktoken', 'pack', 'palm', 'paparazzi', 'pkcs11', 'platform', 'pop', 'pres', 'prospero', 'proxy', 'psyc', 'query', 'redis', 'rediss', 'reload', 'res', 'resource', 'rmi', 'rsync', 'rtmfp', 'rtmp', 'rtsp', 'rtsps', 'rtspu', 'secondlife', 'service', 'session', 'sftp', 'sgn', 'shttp', 'sieve', 'sip', 'sips', 'skype', 'smb', 'sms', 'smtp', 'snews', 'snmp', 'soap.beep', 'soap.beeps', 'soldat', 'spotify', 'ssh', 'steam', 'stun', 'stuns', 'submit', 'svn', 'tag', 'teamspeak', 'tel', 'teliaeid', 'telnet', 'tftp', 'things', 'thismessage', 'tip', 'tn3270', 'turn', 'turns', 'tv', 'udp', 'unreal', 'urn', 'ut2004', 'vemmi', 'ventrilo', 'videotex', 'view-source', 'wais', 'webcal', 'ws', 'wss', 'wtai', 'wyciwyg', 'xcon', 'xcon-userid', 'xfire', 'xmlrpc.beep', 'xmlrpc.beeps', 'xmpp', 'xri', 'ymsgr', 'z39.50', 'z39.50r', 'z39.50s',
]

const ALPHA: { [key: string]: RegExp } = {
    en: /^[A-Z]*$/i,
    cs: /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]*$/i,
    da: /^[A-ZÆØÅ]*$/i,
    de: /^[A-ZÄÖÜß]*$/i,
    es: /^[A-ZÁÉÍÑÓÚÜ]*$/i,
    fr: /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]*$/i,
    lt: /^[A-ZĄČĘĖĮŠŲŪŽ]*$/i,
    nl: /^[A-ZÉËÏÓÖÜ]*$/i,
    hu: /^[A-ZÁÉÍÓÖŐÚÜŰ]*$/i,
    pl: /^[A-ZĄĆĘŚŁŃÓŻŹ]*$/i,
    pt: /^[A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ]*$/i,
    ru: /^[А-ЯЁ]*$/i,
    sk: /^[A-ZÁÄČĎÉÍĹĽŇÓŔŠŤÚÝŽ]*$/i,
    sr: /^[A-ZČĆŽŠĐ]*$/i,
    tr: /^[A-ZÇĞİıÖŞÜ]*$/i,
    uk: /^[А-ЩЬЮЯЄІЇҐ]*$/i,
    ar: /^[ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]*$/,
}

const ALPHA_NUMERIC: { [key: string]: RegExp }  = {
    en: /^[0-9A-Z]*$/i,
    cs: /^[0-9A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]*$/i,
    da: /^[0-9A-ZÆØÅ]$/i,
    de: /^[0-9A-ZÄÖÜß]*$/i,
    es: /^[0-9A-ZÁÉÍÑÓÚÜ]*$/i,
    fr: /^[0-9A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]*$/i,
    lt: /^[0-9A-ZĄČĘĖĮŠŲŪŽ]*$/i,
    hu: /^[0-9A-ZÁÉÍÓÖŐÚÜŰ]*$/i,
    nl: /^[0-9A-ZÉËÏÓÖÜ]*$/i,
    pl: /^[0-9A-ZĄĆĘŚŁŃÓŻŹ]*$/i,
    pt: /^[0-9A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ]*$/i,
    ru: /^[0-9А-ЯЁ]*$/i,
    sk: /^[0-9A-ZÁÄČĎÉÍĹĽŇÓŔŠŤÚÝŽ]*$/i,
    sr: /^[0-9A-ZČĆŽŠĐ]*$/i,
    tr: /^[0-9A-ZÇĞİıÖŞÜ]*$/i,
    uk: /^[0-9А-ЩЬЮЯЄІЇҐ]*$/i,
    ar: /^[٠١٢٣٤٥٦٧٨٩0-9ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]*$/,
}

const ALPHA_DASH: { [key: string]: RegExp }  = {
    en: /^[0-9A-Z_-]*$/i,
    cs: /^[0-9A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ_-]*$/i,
    da: /^[0-9A-ZÆØÅ_-]*$/i,
    de: /^[0-9A-ZÄÖÜß_-]*$/i,
    es: /^[0-9A-ZÁÉÍÑÓÚÜ_-]*$/i,
    fr: /^[0-9A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ_-]*$/i,
    lt: /^[0-9A-ZĄČĘĖĮŠŲŪŽ_-]*$/i,
    nl: /^[0-9A-ZÉËÏÓÖÜ_-]*$/i,
    hu: /^[0-9A-ZÁÉÍÓÖŐÚÜŰ_-]*$/i,
    pl: /^[0-9A-ZĄĆĘŚŁŃÓŻŹ_-]*$/i,
    pt: /^[0-9A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ_-]*$/i,
    ru: /^[0-9А-ЯЁ_-]*$/i,
    sk: /^[0-9A-ZÁÄČĎÉÍĹĽŇÓŔŠŤÚÝŽ_-]*$/i,
    sr: /^[0-9A-ZČĆŽŠĐ_-]*$/i,
    tr: /^[0-9A-ZÇĞİıÖŞÜ_-]*$/i,
    uk: /^[0-9А-ЩЬЮЯЄІЇҐ_-]*$/i,
    ar: /^[٠١٢٣٤٥٦٧٨٩0-9ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ_-]*$/,
}

export {
    types,
    ALPHA,
    ALPHA_NUMERIC,
    ALPHA_DASH,
    DEPENDENT_RULES,
    DEFAULT_LOCALE,
    REGEXP_IS_UINT,
    URL_PROTOCOLS,
}
