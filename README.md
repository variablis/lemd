### Pieprasījumi
Pieprasījumi tiek sagaidīti / adresē.
Jebkādu citu adrešu gadījumā tiek atgriezta kļūda 400 - Bad request.

### JSON formātā
Header:
```c
Accept: application/json
```
Vaicājums:
```c
{"query": "phone", "page": 1}
```

Atbilde:
```c
[
    {
        "title": "iPhone 9",
        "total_price": 477.85,
        "description": "An apple mobile which is nothing like apple"
    },
    {
        "title": "iPhone X",
        "total_price": 737.72,
        "description": "SIM-Free, Model A19211 6.5-inch Super Retina HD display with OLED technology A12 Bionic chip with ..."
    }
]
```

Log žurnāls:
```c
{
  type: 'messageIn',
  method: 'POST',
  path: '/',
  body: { query: 'phone', page: 1 },  
  dateTime: '2024-05-15T06:46:40.441Z'
}
{
  type: 'messageOut',
  dateTime: '2024-05-15T06:46:41.089Z',
  body: '[{"title":"iPhone 9","final_price":477.85,"description":"An apple mobile which is nothing like apple"},{"title":"iPhone X","final_price":737.72,"description":"SIM-Free, 
Model A19211 6.5-inch Super Retina HD display with OLED technology A12 Bionic chip with ..."}]',
  fault: ''
}
```

### XML formātā
Header:
```c
Accept: application/xml
```
Vaicājums:
```c
<request>
    <query>phone</query>
    <page>1</page>
</request>
```

Atbilde:
```c
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<root>
    <title>iPhone 9</title>
    <total_price>477.85</total_price>
    <description>An apple mobile which is nothing like apple</description>
    <title>iPhone X</title>
    <total_price>737.72</total_price>
    <description>SIM-Free, Model A19211 6.5-inch Super Retina HD display with OLED technology A12 Bionic chip with ...</description>
</root>
```

Log žurnāls:
```c
{
  type: 'messageIn',
  method: 'POST',
  path: '/',
  body: '<request>\r\n    <query>phone</query>\r\n    <page>1</page>\r\n</request>',     
  dateTime: '2024-05-15T06:49:08.907Z'
}
{
  type: 'messageOut',
  dateTime: '2024-05-15T06:49:09.435Z',
  body: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n' +
    '<root>\n' +
    '  <title>iPhone 9</title>\n' +
    '  <final_price>477.85</final_price>\n' +
    '  <description>An apple mobile which is nothing like apple</description>\n' +       
    '  <title>iPhone X</title>\n' +
    '  <final_price>737.72</final_price>\n' +
    '  <description>SIM-Free, Model A19211 6.5-inch Super Retina HD display with OLED technology A12 Bionic chip with ...</description>\n' +
    '</root>',
  fault: ''
}
```
