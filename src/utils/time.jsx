export function minutesToHoursMinutes(n) {
        var hours = (Math.abs(n) / 60);
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);
        return String(rhours < 0 ? 0 : rhours).padStart(2, "0") + ":" + String(rminutes).padStart(2, "0");
}