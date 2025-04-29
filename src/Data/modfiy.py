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
    # Initialize the result with all days set to "geschlossen"
    result = [{"tag": days_mapping[day], "zeit": "geschlossen"} for day in days_mapping]

    # Remove unwanted characters and irrelevant mentions (e.g., PH, months)
    opening_hours = re.sub(r"[+]|PH|[A-Za-z]{3,}:[^,]*", "", opening_hours)
    parts = opening_hours.split(";")

    for part in parts:
        # Match days and times (e.g., "Mo-Fr 12:00-18:00" or "Mo-Fr 11:00-14:00,17:00-22:00")
        match = re.match(r"([A-Za-z,-]+)\s+([\d:,-]+)", part.strip())
        if match:
            days, times = match.groups()
            # Expand day ranges (e.g., "Mo-Fr" -> ["Mo", "Tu", "We", "Th", "Fr"])
            expanded_days = expand_days(days)
            for day in expanded_days:
                if day in days_mapping:  # Ensure the day is valid
                    for entry in result:
                        if entry["tag"] == days_mapping[day]:
                            # Handle multiple time ranges (e.g., "11:00-14:00,17:00-22:00")
                            if entry["zeit"] == "geschlossen":
                                entry["zeit"] = times
                            else:
                                entry["zeit"] += f",{times}"
                            break

    # Ensure all days are properly formatted
    for entry in result:
        if entry["zeit"] != "geschlossen":
            # Remove any trailing commas or whitespace
            entry["zeit"] = entry["zeit"].strip(",")

    return result


def expand_days(days):
    """Expand day ranges and individual days into a list of valid day abbreviations."""
    day_list = []
    ranges = days.split(",")
    for r in ranges:
        if "-" in r:
            start, end = r.split("-")
            if start in days_mapping and end in days_mapping:  # Validate day abbreviations
                start_idx = list(days_mapping.keys()).index(start)
                end_idx = list(days_mapping.keys()).index(end)
                if start_idx <= end_idx:
                    day_list.extend(list(days_mapping.keys())[start_idx:end_idx + 1])
                else:  # Handle wrap-around (e.g., "Fr-Mo")
                    day_list.extend(list(days_mapping.keys())[start_idx:])
                    day_list.extend(list(days_mapping.keys())[:end_idx + 1])
        elif r in days_mapping:  # Validate individual day abbreviation
            day_list.append(r)
    return day_list

# Load the GeoJSON file
with open("/home/moritz-elfeld/mc/firstApp/src/Layers/restaurant.json", "r", encoding="utf-8") as file:
    data = json.load(file)

# Process each feature in the GeoJSON
for feature in data["features"]:
    properties = feature["properties"]
    if "opening_hours" not in properties:
        continue  # Skip if "opening_hours" does not exist
    opening_hours = properties["opening_hours"]
    # Parse the opening_hours and replace it with the new format
    properties["oeffnungszeiten"] = parse_opening_hours(opening_hours)
    # Remove the old opening_hours key
    del properties["opening_hours"]

# Save the modified GeoJSON back to a file
with open("restaurant_modified2.json", "w", encoding="utf-8") as file:
    json.dump(data, file, ensure_ascii=False, indent=2)

print("GeoJSON file has been updated and saved as 'restaurant_modified.json'.")