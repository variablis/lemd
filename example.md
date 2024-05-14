### Pieprasījumi
Pieprasījumi tiek sagaidīti / adresē.
Jebkādu citu adrešu gadījumā tiek atgriezta kļūda 400 - Bad request.


### JSON formātā
Vaicājums:
```
{"query": "phone", "page": 1}
```

Atbilde:
```
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

### XML formātā
Vaicājums:
```
<request>
    <query>phone</query>
    <page>1</page>
</request>
```

Atbilde:
```
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
