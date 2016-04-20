var xlsx = require('node-xlsx');
var fs = require('fs');

var rows = [
  ["id",
    "order_status",
    "logistics_time",
    "logistics_name",
    "logistics_ticket",
    "refund_order_id",
    "settle_order_id"
  ],
  [146805,
    32,
    "",
    "zongtong",
    "761763053154",
    "",
    ""
  ]
];

var obj = {
  name: '回传单',
  data: rows
};
var file = xlsx.build([obj]);
fs.writeFileSync('b.xlsx', file, 'binary');