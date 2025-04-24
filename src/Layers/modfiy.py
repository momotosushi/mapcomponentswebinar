import json
import re

# Define a mapping of days in English to German
days_mapping = {
    "Mo": "Montag",
    "Tu": "Dienstag",
    "We": "Mittwoch",
    "Th": "Donnerstag",
    "Fr": "Freitag",
    "Sa": "Samstag",
    "Su": "Sonntag",
}

# Default closed hours
default_closed = {"zeit": "geschlossen"}

def parse_opening_hours(opening_hours):
    # Initialize the result with all days closed
    result = [{"tag": day, "zeit": default_closed["zeit"]} for day in days_mapping.values()]

    # Split the opening_hours string by semicolons
    periods = opening_hours.split(";")
    for period in periods:
        # Handle date ranges (e.g., "May-Sep: We-Mo,PH 10:00-20:00")
        if ":" in period:
            _, period = period.split(":", 1)  # Ignore the date range for now

        # Match the day(s) and time(s) using regex
        match = re.match(r"([A-Za-z,PH\-]+)\s([\d:–,\-+]+)", period.strip())
        if match:
            days, times = match.groups()
            times = times.replace("+", "")  # Remove "+" if present
            # Handle multiple days (e.g., "Tu-Fr")
            for day_range in days.split(","):
                if "-" in day_range:
                    start_day, end_day = day_range.split("-")
                    if start_day in days_mapping and end_day in days_mapping:
                        start_index = list(days_mapping.keys()).index(start_day)
                        end_index = list(days_mapping.keys()).index(end_day)
                        for i in range(start_index, end_index + 1):
                            result[i]["zeit"] = merge_times(result[i]["zeit"], times)
                elif day_range in days_mapping:  # Single day in a range
                    index = list(days_mapping.keys()).index(day_range)
                    result[index]["zeit"] = merge_times(result[index]["zeit"], times)
                elif "PH" in day_range:  # Handle public holidays (PH)
                    for day in result:
                        day["zeit"] = merge_times(day["zeit"], times)
    return result

def merge_times(existing_time, new_time):
    """Merge existing and new time ranges."""
    if existing_time == default_closed["zeit"]:
        return new_time
    return f"{existing_time}, {new_time}"

# Load the GeoJSON file
with open("/home/moritz-elfeld/mc/firstApp/src/Layers/restaurant.json", "r", encoding="utf-8") as file:
    data = json.load(file)

# Process each feature in the GeoJSON
for feature in data["features"]:
    properties = feature["properties"]
    if "opening_hours" in properties:
        opening_hours = properties["opening_hours"]
        # Parse the opening_hours and replace it with the new format
        properties["oeffnungszeiten"] = parse_opening_hours(opening_hours)
        # Remove the old opening_hours key
        del properties["opening_hours"]

# Save the modified GeoJSON back to a file
with open("restaurant_modified.json", "w", encoding="utf-8") as file:
    json.dump(data, file, ensure_ascii=False, indent=2)

print("GeoJSON file has been updated and saved as 'restaurant_modified.json'.")