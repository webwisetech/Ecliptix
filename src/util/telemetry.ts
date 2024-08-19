export default function(data: Record<string, any>, json: Record<string, any>){
    if(!json.telemetry) return; // if telemetry is off, don't send anything

    // send data anonymously
    data["message"] = json.telemetry_msg;
    data["proj"] = json.name;
} // TODO: finish this, keep telemetry off by default