import accepted from './accepted'
import after_or_equal from './after_or_equal' 
import after from './after' 
import alpha_dash from './alpha_dash' 
import alpha_num from './alpha_num' 
import alpha from './alpha' 
import array from './array' 
import before_or_equal from './before_or_equal' 
import before from './before' 
import between from './between' 
import boolean from './boolean' 
import confirmed from './confirmed' 
import date_equals from './date_equals' 
import date_format from './date_format' 
import date from './date' 
import different from './different' 
import digits_between from './digits_between' 
import digits from './digits'
import distinct from './distinct' 
import email from './email'
import filled from './filled'
import in_array from './in_array' 
import integer from './integer' 
import In from './in' 
import ip from './ip' 
import ipv4 from './ipv4' 
import ipv6 from './ipv6' 
import json from './json' 
import max from './max' 
import min from './min' 
import not_in from './not_in' 
import nullable from './nullable' 
import numeric from './numeric' 
import present from './present' 
import regex from './regex' 
import required_if from './required_if' 
import required from './required' 
import required_unless from './required_unless' 
import required_with_all from './required_with_all' 
import required_without_all from './required_without_all' 
import required_without from './required_without' 
import required_with from './required_with' 
import same from './same' 
import size from './size' 
import string from './string'
import url from './url' 

const rules: any = {
    accepted,
    after_or_equal,
    after,
    alpha_dash,
    alpha_num,
    alpha,
    array,
    before_or_equal,
    before,
    between,
    boolean,
    confirmed,
    date_equals,
    date_format,
    date,
    different,
    digits_between,
    digits,
    distinct,
    email,
    filled,
    in_array,
    integer,
    in: In,
    ip,
    ipv4,
    ipv6,
    json,
    max,
    min,
    not_in,
    nullable,
    numeric,
    present,
    regex,
    required_if,
    required,
    required_unless,
    required_with_all,
    required_without_all,
    required_without,
    required_with,
    same,
    size,
    string,
    url,
}

export default rules
