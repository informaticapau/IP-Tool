const CLASSES = ["A", "B", "C", "D", "E"];

const CLASSPREFIXES = [
    "0",    // A
    "10",   // B
    "110",  // C
    "1110", // D
    "1111"  // E
];

const getIPOctets = (ip) => ip.split(".");

const octetToBinary = (octet) => parseInt(octet).toString(2).padStart(8, "0");

const maskToBinary = (mask) => "1".repeat(mask).padEnd(32, "0");

const getIPClass = (ip) => {

    const firstOctetBinary = octetToBinary(getIPOctets(ip)[0]);

    for (i = 0; i < CLASSES.length; i++) {
        if (firstOctetBinary.startsWith(CLASSPREFIXES[i])) {
            return CLASSES[i];
        }
    }
}

const validateIPv4 = (ip) => {

    let regexOctetString = "(?:"; // Number from 0 to 255
    regexOctetString += "[01]?[0-9][0-9]?" + "|"; // 0 - 199
    regexOctetString += "2[0-4][0-9]?" + "|"; // 200 - 249
    regexOctetString += "25[0-5]"; // 250 - 255
    regexOctetString += ")";

    let regexIPv4String = "^"; // Line start
    regexIPv4String += `(?:${regexOctetString}\\.){3}${regexOctetString}`;
    regexIPv4String += "$"; // Line end

    return RegExp(regexIPv4String).test(ip);
}


/* TABLE STUFF */

const updateRow = (row, values) => {
    
    for (let i = 0; i < 4; i++) {
        row.cells[i+1].innerText = values[i];
    }

}

const clearRow = (row) => {
    
    for (let i = 0; i < 4; i++) {
        row.cells[i+1].innerText = "";
    }

}


/* HANDLERS */

const ipHandler = (sender) => {

    const updateIPRow = (ip) => {

        let row, values;

        row = document.getElementById("tr-ip-dec");
        values = getIPOctets(ip);
        updateRow(row, values);

        row = document.getElementById("tr-ip-bin");
        values = getIPOctets(ip).map(x => octetToBinary(x));
        updateRow(row, values);

    }

    const updateClassInfo = (ip) => {

        const prettifyFirstOctet = (octet) => {

            const firstOctetBinary = octetToBinary(octet);

            for (const prefix of CLASSPREFIXES) {
                if (firstOctetBinary.startsWith(prefix)) {
                    return `<b>${prefix}</b>`
                        + firstOctetBinary.slice(prefix.length)
                };
            }
        }


        let e;
        e = document.getElementById("class-info-first-octet");
        e.innerHTML = prettifyFirstOctet(getIPOctets(ip)[0]);

        e = document.getElementById("class-info-ip-class");
        e.innerText = getIPClass(ip);
    }

    const ip = sender.value;

    if (validateIPv4(ip)) {
        updateIPRow(ip);
        updateClassInfo(ip);
    } else {
        clearRow(document.getElementById("tr-ip-dec"));
        clearRow(document.getElementById("tr-ip-bin"));
    }
}

const maskHandler = (sender) => {

    const checkMask = (sender) => {
        let min = sender.min;
        let max = sender.max;

        let value = parseInt(sender.value);

        if (value > max) {
            sender.value = max;
        } else if (value < min) {
            sender.value = min;
        }
    }

    const updateMaskRow = (mask) => {

        let row, values;

        row = document.getElementById("tr-mask-bin");
        values = maskToBinary(mask).match(/.{8}/g) // Split mask
        updateRow(row, values);

        row = document.getElementById("tr-mask-dec");
        values = values.map(x => parseInt(x, 2)); // Change to base 10
        updateRow(row, values);

    }

    checkMask(sender);
    updateMaskRow(sender.value);
}

const classfulHandler = (sender) => {

    let e;

    /* Disable mask input*/
    e = document.getElementById("mask");
    e.value = ""
    e.disabled = sender.checked;

    /* Hide or dispay mask rows */
    e = document.getElementById("tr-mask-dec");
    e.hidden = sender.checked;
    clearRow(e);
    e = document.getElementById("tr-mask-bin");
    e.hidden = sender.checked;
    clearRow(e);

    /* Display class info */
    e = document.getElementById("class-info");
    e.hidden = !sender.checked;
}
