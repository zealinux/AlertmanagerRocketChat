class Script {
    process_incoming_request({
        request
    }) {
        console.log(request.content);

        let alertColor = "warning";
        let status = request.content.status;

        if (status == "resolved") {
            alertColor = "good";
        } else if (status == "firing") {
            alertColor = "danger";
        }

        let finFields = [];
        let alerts = request.content.alerts;

        alerts.forEach((alert, _) => {
            let labels = alert.labels;
            let elem = {
                title: "alertname: " + labels.alertname,
                value: "*instance:* " + labels.instance,
                short: false
            };

            finFields.push(elem);

            let annotations = alert.annotations;
            let titles = ["summary", "severity", "description"];

            titles.forEach((item, _) => {
                let annotation = annotations[item];

                if (!!annotation) {
                    finFields.push({
                        title: item,
                        value: annotation
                    });
                }
            })
        });

        return {
            content: {
                username: "Prometheus Alert",
                attachments: [{
                    color: alertColor,
                    title_link: request.content.externalURL,
                    title: "Prometheus notification",
                    fields: finFields
                }]
            }
        };
    }
}