
function replaceProp(obj, oldProp, newProp, append = false) {
    var v = obj[oldProp]
    if (append) {
        v += append
    }
    delete obj[oldProp]
    obj[newProp] = v
}

//const csvFilePath = './small.csv'
const csvFilePath = './xplore_ticket_export.csv'


const ignore_ticket_ids = [
    "10067", "10132", "10193", "10210", "10242", "10243", "10244", "10245", "10246", "10247", "10248", "10249", "10250", "10251", "10252", "10253", "10254", 
    "10255", "10256", "10257", "10258", "10259", "10436", "10437", "10438", "10439", "10440", "10441", "10442", "10443", "10444", "10445", "10446", "10447", 
    "10448", "10449", "10450", "10451", "10452", "10453", "10454", "10511", "10512", "10513", "10242", "10245", "10244", "10247", "10246", "10252", "10251", 
    "10250", "10249", "10248", "10255", "10254", "10253", "10259", "10258", "10453", "10257", "10256", "10436", "10437", "10438", "10439", "10440", "10441", 
    "10442", "10443", "10444", "10445", "10446", "10447", "10448", "10449", "12785", "10882", "10778", "10777", "10776", "10775", "10774", "11283", "11282", 
    "10513", "10512", "10511", "14437", "14436", "14435", "14434", "14433", "14432", "14431", "14430", "14429", "14428", "14427", "14426", "14425", "14424", 
    "14423", "14422", "14421", "14420", "14419", "14418", "10454", "10452", "10451", "10450", "12134", "12133", "12134", "12133", "21318", "14410", "10377", 
    "12229", "15720", "15721", "15722", "15724", "15725", "15726", "15727", "15728", "15729", "15730", "15731", "15732", "15733", "15734", "15735", "15736", 
    "15737", "15738", "15739", "15719"
];

var ignored_ts = 0;

const csv = require('csvtojson')
csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
        /**
         * [
         * 	{a:"1", b:"2", c:"3"},
         * 	{a:"4", b:"5". c:"6"}
         * ]
         */
        jsonObj.forEach(element => {
            replaceProp(element, 'Ticket ID', '_id')

            replaceProp(element, "Salesforce MDB Team", "sfdc_mdb_team")
            replaceProp(element, "Salesforce Region", "sfdc_region")
            replaceProp(element, "Salesforce Role", "sfdc_role")
            replaceProp(element, 'Salesforce Segment', "sfdc_segment")

            replaceProp(element, "Requester email", "requester")
            replaceProp(element, "Asignee email", "asignee")
            replaceProp(element, "Country", "requester_country")

            replaceProp(element, "Type Of Request (SA)", "request_type_sa")
            replaceProp(element, "Ticket status", "status")
            replaceProp(element, "Completion Code (RPC)", "completion_cd_rpc")
            replaceProp(element, "Manager Email", "requester_mgr")
            replaceProp(element, "Ticket subject", "subj")
            replaceProp(element, "SFDC Opportunity link (or Account link)", "sfdc_link")

            var date = element["Ticket created - Date"]
            replaceProp(element, "Ticket created - Date", "created_at", "T00:00:01Z")
            element["updated_at"] = element["created_at"]


            element["satisfaction_rating"] = "unoffered"

            delete element['Tickets']
            delete element['Requester name']
            delete element['Area Group']
            delete element['SFDC Opportunity link (or Account link)']

            if (ignore_ticket_ids.indexOf(element["_id"]) == -1) {
                console.log("%j", element);
            } else {
                console.warn("Ticket witg ID %s Ignored", element["_id"]);
                ignored_ts++;
            }



        });
        console.warn("%i Tickets Ignored", ignored_ts);

        /*
        {
            'Ticket created - Date': '2022-01-19',
            'Ticket status': 'Closed',
            'Ticket subject': 'Invitation: Atlas Search Office Hours @ Wed Mar 23, 2022 8:30am - 9:30am (PDT) (rpc-request@mongodb-sales.zendesk.com)',
            'Requester name': 'Marcus Eagan',
            'Type Of Request (SA)': '',
           : 'Product Management',
            'Salesforce Region': '',
            Country: 'United States',
            'Salesforce Role': 'Product Management',
            'Area Group': '',
            'Salesforce MDB Team': 'Product Management',
            'Requester email': 'marcus.eagan@mongodb.com',
            'Manager Email': 'andrew.davidson@mongodb.com',
            'SFDC Opportunity link (or Account link)': '',
            'Completion Code (RPC)': '',
            Tickets: '1.00000000000000000000
    
        // TRANSFOR TO THIS
        // {
            /*
            "_id": {
                    "$numberInt": "10377"
                },
                "assignee": "mitch.berke@mongodb.com",
                "completion_cd_rpc": null,
                "created_at": "2022-01-19T19:29:43Z",
                "priority": "normal",
                "request_type_sa": "sales_call",
                "requester": "mitch.berke@mongodb.com",
                "satisfaction_rating": "unoffered",
                "sfdc_mdb_team": "SA Manager",
                "sfdc_region": "SA Director",
                "sfdc_role": "SA Austin Manager",
                "sfdc_segment": "Corporate",
                "status": "open",
                "subj": "test from Mitch",
                "submitter": "mitch.berke@mongodb.com",
                "updated_at": "2022-11-16T18:25:53Z",
                "requester_country": "United States",
                "requester_mgr": "chris.sechler@mongodb.com",
                "created_ts": {
                    "$date": {
                        "$numberLong": "1642620583000"
                    }
                },
                "updated_ts": {
                    "$date": {
                        "$numberLong": "1668623153000"
                    }
                }
            } 
            */
    })
