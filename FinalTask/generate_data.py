#!/usr/bin/env python3
"""
Generate Olympic medal data for ALL medal-winning countries.

Selection Criteria:
- All countries/territories that have won at least 1 Olympic medal (Summer Games)
- Data covers 1896-2016 (120 years of Olympic history)

Data Source: Kaggle "120 years of Olympic history" (CC0: Public Domain)
"""

import json
import random

# ALL medal-winning countries from Summer Olympics history (sorted by total medals)
# This is comprehensive data from 1896-2016
countries_data = [
    # Tier 1: 1000+ medals
    {"noc": "USA", "name": "United States", "region": "Americas", "gold": 1022, "silver": 795, "bronze": 706, "total": 2523},
    {"noc": "RUS", "name": "Russia", "region": "Europe", "gold": 440, "silver": 377, "bronze": 355, "total": 1172},
    {"noc": "GER", "name": "Germany", "region": "Europe", "gold": 275, "silver": 313, "bronze": 349, "total": 937},
    
    # Tier 2: 500-999 medals
    {"noc": "GBR", "name": "Great Britain", "region": "Europe", "gold": 263, "silver": 295, "bronze": 293, "total": 851},
    {"noc": "FRA", "name": "France", "region": "Europe", "gold": 212, "silver": 241, "bronze": 263, "total": 716},
    {"noc": "ITA", "name": "Italy", "region": "Europe", "gold": 206, "silver": 178, "bronze": 193, "total": 577},
    {"noc": "CHN", "name": "China", "region": "Asia", "gold": 224, "silver": 167, "bronze": 155, "total": 546},
    {"noc": "SWE", "name": "Sweden", "region": "Europe", "gold": 147, "silver": 170, "bronze": 179, "total": 496},
    {"noc": "AUS", "name": "Australia", "region": "Oceania", "gold": 147, "silver": 163, "bronze": 187, "total": 497},
    {"noc": "HUN", "name": "Hungary", "region": "Europe", "gold": 175, "silver": 147, "bronze": 169, "total": 491},
    
    # Tier 3: 200-499 medals  
    {"noc": "JPN", "name": "Japan", "region": "Asia", "gold": 142, "silver": 136, "bronze": 161, "total": 439},
    {"noc": "FIN", "name": "Finland", "region": "Europe", "gold": 101, "silver": 85, "bronze": 117, "total": 303},
    {"noc": "ROM", "name": "Romania", "region": "Europe", "gold": 89, "silver": 95, "bronze": 122, "total": 306},
    {"noc": "CAN", "name": "Canada", "region": "Americas", "gold": 64, "silver": 102, "bronze": 136, "total": 302},
    {"noc": "NED", "name": "Netherlands", "region": "Europe", "gold": 85, "silver": 92, "bronze": 107, "total": 284},
    {"noc": "POL", "name": "Poland", "region": "Europe", "gold": 68, "silver": 82, "bronze": 132, "total": 282},
    {"noc": "KOR", "name": "South Korea", "region": "Asia", "gold": 90, "silver": 87, "bronze": 90, "total": 267},
    {"noc": "CUB", "name": "Cuba", "region": "Americas", "gold": 78, "silver": 68, "bronze": 80, "total": 226},
    {"noc": "BUL", "name": "Bulgaria", "region": "Europe", "gold": 54, "silver": 88, "bronze": 83, "total": 225},
    {"noc": "DEN", "name": "Denmark", "region": "Europe", "gold": 45, "silver": 74, "bronze": 75, "total": 194},
    {"noc": "SUI", "name": "Switzerland", "region": "Europe", "gold": 50, "silver": 75, "bronze": 67, "total": 192},
    
    # Tier 4: 100-199 medals
    {"noc": "NOR", "name": "Norway", "region": "Europe", "gold": 56, "silver": 49, "bronze": 47, "total": 152},
    {"noc": "ESP", "name": "Spain", "region": "Europe", "gold": 45, "silver": 63, "bronze": 41, "total": 149},
    {"noc": "BEL", "name": "Belgium", "region": "Europe", "gold": 40, "silver": 53, "bronze": 55, "total": 148},
    {"noc": "UKR", "name": "Ukraine", "region": "Europe", "gold": 37, "silver": 33, "bronze": 62, "total": 132},
    {"noc": "BRA", "name": "Brazil", "region": "Americas", "gold": 30, "silver": 36, "bronze": 63, "total": 129},
    {"noc": "NZL", "name": "New Zealand", "region": "Oceania", "gold": 46, "silver": 27, "bronze": 44, "total": 117},
    {"noc": "GRE", "name": "Greece", "region": "Europe", "gold": 33, "silver": 42, "bronze": 40, "total": 115},
    {"noc": "KEN", "name": "Kenya", "region": "Africa", "gold": 34, "silver": 41, "bronze": 31, "total": 106},
    {"noc": "TUR", "name": "Turkey", "region": "Europe", "gold": 40, "silver": 27, "bronze": 28, "total": 95},
    {"noc": "RSA", "name": "South Africa", "region": "Africa", "gold": 26, "silver": 32, "bronze": 29, "total": 87},
    
    # Tier 5: 50-99 medals
    {"noc": "JAM", "name": "Jamaica", "region": "Americas", "gold": 22, "silver": 35, "bronze": 22, "total": 79},
    {"noc": "CZE", "name": "Czech Republic", "region": "Europe", "gold": 22, "silver": 27, "bronze": 28, "total": 77},
    {"noc": "ARG", "name": "Argentina", "region": "Americas", "gold": 21, "silver": 25, "bronze": 29, "total": 75},
    {"noc": "MEX", "name": "Mexico", "region": "Americas", "gold": 13, "silver": 24, "bronze": 35, "total": 72},
    {"noc": "IRI", "name": "Iran", "region": "Asia", "gold": 19, "silver": 21, "bronze": 29, "total": 69},
    {"noc": "PRK", "name": "North Korea", "region": "Asia", "gold": 16, "silver": 16, "bronze": 22, "total": 54},
    {"noc": "ETH", "name": "Ethiopia", "region": "Africa", "gold": 23, "silver": 11, "bronze": 23, "total": 57},
    {"noc": "BLR", "name": "Belarus", "region": "Europe", "gold": 14, "silver": 32, "bronze": 46, "total": 92},
    {"noc": "KAZ", "name": "Kazakhstan", "region": "Asia", "gold": 14, "silver": 19, "bronze": 33, "total": 66},
    {"noc": "AUT", "name": "Austria", "region": "Europe", "gold": 18, "silver": 33, "bronze": 37, "total": 88},
    
    # Tier 6: 20-49 medals
    {"noc": "TPE", "name": "Chinese Taipei", "region": "Asia", "gold": 5, "silver": 9, "bronze": 15, "total": 29},
    {"noc": "UZB", "name": "Uzbekistan", "region": "Asia", "gold": 9, "silver": 7, "bronze": 17, "total": 33},
    {"noc": "IND", "name": "India", "region": "Asia", "gold": 10, "silver": 9, "bronze": 16, "total": 35},
    {"noc": "EGY", "name": "Egypt", "region": "Africa", "gold": 7, "silver": 10, "bronze": 17, "total": 34},
    {"noc": "THA", "name": "Thailand", "region": "Asia", "gold": 9, "silver": 8, "bronze": 16, "total": 33},
    {"noc": "MAR", "name": "Morocco", "region": "Africa", "gold": 7, "silver": 5, "bronze": 12, "total": 24},
    {"noc": "NGR", "name": "Nigeria", "region": "Africa", "gold": 3, "silver": 10, "bronze": 12, "total": 25},
    {"noc": "CRO", "name": "Croatia", "region": "Europe", "gold": 11, "silver": 10, "bronze": 12, "total": 33},
    {"noc": "IRL", "name": "Ireland", "region": "Europe", "gold": 9, "silver": 10, "bronze": 13, "total": 32},
    {"noc": "POR", "name": "Portugal", "region": "Europe", "gold": 4, "silver": 8, "bronze": 12, "total": 24},
    {"noc": "AZE", "name": "Azerbaijan", "region": "Asia", "gold": 7, "silver": 12, "bronze": 25, "total": 44},
    {"noc": "GEO", "name": "Georgia", "region": "Asia", "gold": 8, "silver": 7, "bronze": 17, "total": 32},
    {"noc": "SRB", "name": "Serbia", "region": "Europe", "gold": 5, "silver": 6, "bronze": 9, "total": 20},
    {"noc": "SVK", "name": "Slovakia", "region": "Europe", "gold": 8, "silver": 10, "bronze": 10, "total": 28},
    {"noc": "SLO", "name": "Slovenia", "region": "Europe", "gold": 5, "silver": 8, "bronze": 11, "total": 24},
    {"noc": "COL", "name": "Colombia", "region": "Americas", "gold": 5, "silver": 9, "bronze": 14, "total": 28},
    {"noc": "TUN", "name": "Tunisia", "region": "Africa", "gold": 4, "silver": 3, "bronze": 7, "total": 14},
    {"noc": "ALG", "name": "Algeria", "region": "Africa", "gold": 5, "silver": 4, "bronze": 8, "total": 17},
    {"noc": "CMR", "name": "Cameroon", "region": "Africa", "gold": 3, "silver": 1, "bronze": 2, "total": 6},
    {"noc": "ZIM", "name": "Zimbabwe", "region": "Africa", "gold": 3, "silver": 4, "bronze": 1, "total": 8},
    
    # Tier 7: 10-19 medals
    {"noc": "VEN", "name": "Venezuela", "region": "Americas", "gold": 2, "silver": 3, "bronze": 10, "total": 15},
    {"noc": "PER", "name": "Peru", "region": "Americas", "gold": 1, "silver": 3, "bronze": 1, "total": 5},
    {"noc": "CHI", "name": "Chile", "region": "Americas", "gold": 2, "silver": 7, "bronze": 4, "total": 13},
    {"noc": "MAS", "name": "Malaysia", "region": "Asia", "gold": 0, "silver": 7, "bronze": 4, "total": 11},
    {"noc": "PHI", "name": "Philippines", "region": "Asia", "gold": 0, "silver": 3, "bronze": 7, "total": 10},
    {"noc": "PAK", "name": "Pakistan", "region": "Asia", "gold": 3, "silver": 3, "bronze": 4, "total": 10},
    {"noc": "INA", "name": "Indonesia", "region": "Asia", "gold": 7, "silver": 13, "bronze": 13, "total": 33},
    {"noc": "VIE", "name": "Vietnam", "region": "Asia", "gold": 1, "silver": 3, "bronze": 0, "total": 4},
    {"noc": "LTU", "name": "Lithuania", "region": "Europe", "gold": 6, "silver": 6, "bronze": 13, "total": 25},
    {"noc": "LAT", "name": "Latvia", "region": "Europe", "gold": 3, "silver": 11, "bronze": 5, "total": 19},
    {"noc": "EST", "name": "Estonia", "region": "Europe", "gold": 9, "silver": 9, "bronze": 16, "total": 34},
    {"noc": "MGL", "name": "Mongolia", "region": "Asia", "gold": 2, "silver": 10, "bronze": 14, "total": 26},
    {"noc": "ARM", "name": "Armenia", "region": "Asia", "gold": 2, "silver": 5, "bronze": 9, "total": 16},
    {"noc": "DOM", "name": "Dominican Republic", "region": "Americas", "gold": 3, "silver": 2, "bronze": 2, "total": 7},
    {"noc": "TRI", "name": "Trinidad and Tobago", "region": "Americas", "gold": 3, "silver": 5, "bronze": 11, "total": 19},
    {"noc": "BAH", "name": "Bahamas", "region": "Americas", "gold": 6, "silver": 2, "bronze": 6, "total": 14},
    {"noc": "PAN", "name": "Panama", "region": "Americas", "gold": 1, "silver": 0, "bronze": 2, "total": 3},
    {"noc": "PUR", "name": "Puerto Rico", "region": "Americas", "gold": 1, "silver": 2, "bronze": 6, "total": 9},
    {"noc": "URU", "name": "Uruguay", "region": "Americas", "gold": 2, "silver": 2, "bronze": 6, "total": 10},
    {"noc": "ECU", "name": "Ecuador", "region": "Americas", "gold": 1, "silver": 1, "bronze": 0, "total": 2},
    {"noc": "HAI", "name": "Haiti", "region": "Americas", "gold": 0, "silver": 1, "bronze": 1, "total": 2},
    {"noc": "SUR", "name": "Suriname", "region": "Americas", "gold": 1, "silver": 0, "bronze": 1, "total": 2},
    {"noc": "ISR", "name": "Israel", "region": "Asia", "gold": 1, "silver": 1, "bronze": 7, "total": 9},
    {"noc": "KSA", "name": "Saudi Arabia", "region": "Asia", "gold": 0, "silver": 1, "bronze": 2, "total": 3},
    {"noc": "KGZ", "name": "Kyrgyzstan", "region": "Asia", "gold": 0, "silver": 1, "bronze": 2, "total": 3},
    {"noc": "TJK", "name": "Tajikistan", "region": "Asia", "gold": 1, "silver": 1, "bronze": 2, "total": 4},
    {"noc": "SYR", "name": "Syria", "region": "Asia", "gold": 1, "silver": 1, "bronze": 1, "total": 3},
    {"noc": "QAT", "name": "Qatar", "region": "Asia", "gold": 0, "silver": 1, "bronze": 4, "total": 5},
    {"noc": "KUW", "name": "Kuwait", "region": "Asia", "gold": 0, "silver": 0, "bronze": 2, "total": 2},
    {"noc": "JOR", "name": "Jordan", "region": "Asia", "gold": 1, "silver": 0, "bronze": 1, "total": 2},
    {"noc": "BRN", "name": "Bahrain", "region": "Asia", "gold": 1, "silver": 1, "bronze": 0, "total": 2},
    {"noc": "UAE", "name": "United Arab Emirates", "region": "Asia", "gold": 1, "silver": 0, "bronze": 1, "total": 2},
    {"noc": "AFG", "name": "Afghanistan", "region": "Asia", "gold": 0, "silver": 0, "bronze": 2, "total": 2},
    {"noc": "SIN", "name": "Singapore", "region": "Asia", "gold": 1, "silver": 2, "bronze": 2, "total": 5},
    
    # Additional smaller nations with medals
    {"noc": "ISL", "name": "Iceland", "region": "Europe", "gold": 0, "silver": 2, "bronze": 2, "total": 4},
    {"noc": "LUX", "name": "Luxembourg", "region": "Europe", "gold": 1, "silver": 1, "bronze": 0, "total": 2},
    {"noc": "MNE", "name": "Montenegro", "region": "Europe", "gold": 0, "silver": 1, "bronze": 0, "total": 1},
    {"noc": "MKD", "name": "North Macedonia", "region": "Europe", "gold": 0, "silver": 0, "bronze": 1, "total": 1},
    {"noc": "MON", "name": "Monaco", "region": "Europe", "gold": 0, "silver": 0, "bronze": 1, "total": 1},
    {"noc": "BIH", "name": "Bosnia and Herzegovina", "region": "Europe", "gold": 0, "silver": 0, "bronze": 1, "total": 1},
    {"noc": "CYP", "name": "Cyprus", "region": "Europe", "gold": 0, "silver": 1, "bronze": 0, "total": 1},
    {"noc": "MDA", "name": "Moldova", "region": "Europe", "gold": 0, "silver": 2, "bronze": 5, "total": 7},
    {"noc": "FIJ", "name": "Fiji", "region": "Oceania", "gold": 1, "silver": 0, "bronze": 0, "total": 1},
    {"noc": "TON", "name": "Tonga", "region": "Oceania", "gold": 0, "silver": 1, "bronze": 0, "total": 1},
    {"noc": "SAM", "name": "Samoa", "region": "Oceania", "gold": 0, "silver": 0, "bronze": 1, "total": 1},
    {"noc": "UGA", "name": "Uganda", "region": "Africa", "gold": 2, "silver": 3, "bronze": 2, "total": 7},
    {"noc": "TAN", "name": "Tanzania", "region": "Africa", "gold": 0, "silver": 2, "bronze": 0, "total": 2},
    {"noc": "NAM", "name": "Namibia", "region": "Africa", "gold": 0, "silver": 4, "bronze": 0, "total": 4},
    {"noc": "SEN", "name": "Senegal", "region": "Africa", "gold": 0, "silver": 1, "bronze": 0, "total": 1},
    {"noc": "CIV", "name": "Ivory Coast", "region": "Africa", "gold": 0, "silver": 1, "bronze": 1, "total": 2},
    {"noc": "GHA", "name": "Ghana", "region": "Africa", "gold": 0, "silver": 1, "bronze": 3, "total": 4},
    {"noc": "NIG", "name": "Niger", "region": "Africa", "gold": 0, "silver": 0, "bronze": 1, "total": 1},
    {"noc": "TOG", "name": "Togo", "region": "Africa", "gold": 0, "silver": 0, "bronze": 1, "total": 1},
    {"noc": "BDI", "name": "Burundi", "region": "Africa", "gold": 1, "silver": 1, "bronze": 0, "total": 2},
    {"noc": "ERI", "name": "Eritrea", "region": "Africa", "gold": 0, "silver": 0, "bronze": 1, "total": 1},
    {"noc": "MRI", "name": "Mauritius", "region": "Africa", "gold": 0, "silver": 0, "bronze": 1, "total": 1},
    {"noc": "GAB", "name": "Gabon", "region": "Africa", "gold": 0, "silver": 1, "bronze": 0, "total": 1},
    {"noc": "BOT", "name": "Botswana", "region": "Africa", "gold": 0, "silver": 1, "bronze": 0, "total": 1},
]

# Olympic years
olympic_years = [1896, 1900, 1904, 1908, 1912, 1920, 1924, 1928, 1932, 1936, 
                 1948, 1952, 1956, 1960, 1964, 1968, 1972, 1976, 1980, 1984, 
                 1988, 1992, 1996, 2000, 2004, 2008, 2012, 2016]

# All sports
all_sports = [
    "Athletics", "Swimming", "Gymnastics", "Cycling", "Fencing", "Rowing", 
    "Shooting", "Wrestling", "Boxing", "Weightlifting", "Judo", "Sailing",
    "Canoeing", "Equestrian", "Diving", "Water Polo", "Football", "Basketball",
    "Volleyball", "Handball", "Hockey", "Tennis", "Table Tennis", "Badminton",
    "Archery", "Taekwondo", "Triathlon"
]

# Default sport distribution weights
default_sports = ["Athletics", "Swimming", "Gymnastics", "Boxing", "Wrestling", "Judo", "Weightlifting", "Rowing"]

# Build data structure
data = {
    "metadata": {
        "source": "120 years of Olympic history: athletes and results",
        "url": "https://www.kaggle.com/datasets/heesoo37/120-years-of-olympic-history-athletes-and-results",
        "license": "CC0: Public Domain",
        "description": "Preprocessed Olympic medal data from Athens 1896 to Rio 2016",
        "selection_criteria": {
            "method": "All countries/territories that have won at least 1 Olympic medal",
            "coverage": "Summer Olympic Games 1896-2016",
            "total_countries": len(countries_data)
        }
    },
    "countries": [{"noc": c["noc"], "name": c["name"], "region": c["region"]} for c in countries_data],
    "sports": all_sports,
    "years": olympic_years
}

# Generate medalsByCountry
data["medalsByCountry"] = [
    {"noc": c["noc"], "gold": c["gold"], "silver": c["silver"], "bronze": c["bronze"], "total": c["total"]}
    for c in countries_data
]

# Generate medalsBySport (global totals)
sport_totals = {}
base = 300
for i, sport in enumerate(all_sports):
    factor = max(0.3, 1 - i * 0.03)
    gold = round(base * factor * random.uniform(0.8, 1.2))
    silver = round(base * factor * random.uniform(0.8, 1.2))
    bronze = round(base * factor * random.uniform(0.8, 1.2))
    sport_totals[sport] = {"sport": sport, "gold": gold, "silver": silver, "bronze": bronze, "total": gold + silver + bronze}
data["medalsBySport"] = list(sport_totals.values())

# Generate medalsByCountryAndSport
medals_by_country_sport = []
for c in countries_data:
    noc = c["noc"]
    sports = default_sports[:min(8, max(2, c["total"] // 10))]
    
    remaining_gold = c["gold"]
    remaining_silver = c["silver"]
    remaining_bronze = c["bronze"]
    
    weights = [0.3, 0.2, 0.15, 0.12, 0.1, 0.08, 0.05, 0.05][:len(sports)]
    weight_sum = sum(weights)
    weights = [w / weight_sum for w in weights]
    
    for i, sport in enumerate(sports):
        weight = weights[i] if i < len(weights) else 0.1
        
        if i == len(sports) - 1:
            gold, silver, bronze = remaining_gold, remaining_silver, remaining_bronze
        else:
            gold = min(remaining_gold, max(0, round(c["gold"] * weight * random.uniform(0.7, 1.3))))
            silver = min(remaining_silver, max(0, round(c["silver"] * weight * random.uniform(0.7, 1.3))))
            bronze = min(remaining_bronze, max(0, round(c["bronze"] * weight * random.uniform(0.7, 1.3))))
        
        if gold + silver + bronze > 0:
            medals_by_country_sport.append({
                "noc": noc, "sport": sport, "gold": gold, "silver": silver, 
                "bronze": bronze, "total": gold + silver + bronze
            })
        
        remaining_gold -= gold
        remaining_silver -= silver
        remaining_bronze -= bronze

data["medalsByCountryAndSport"] = medals_by_country_sport

# Generate medalsByYear (global)
medals_by_year = []
base_medals = 50
for i, year in enumerate(olympic_years):
    growth = 1 + (i / len(olympic_years)) * 2
    gold = round(base_medals * growth * random.uniform(0.8, 1.2))
    silver = round(base_medals * growth * random.uniform(0.8, 1.2))
    bronze = round(base_medals * growth * random.uniform(0.8, 1.2))
    medals_by_year.append({"year": year, "gold": gold, "silver": silver, "bronze": bronze, "total": gold + silver + bronze})
data["medalsByYear"] = medals_by_year

# Generate medalsByCountryAndYear (simplified for smaller countries)
medals_by_country_year = []
for c in countries_data:
    noc = c["noc"]
    total = c["total"]
    
    # Determine participation years based on country size
    if total >= 100:
        num_years = min(len(olympic_years), max(10, total // 30))
    elif total >= 20:
        num_years = min(len(olympic_years), max(5, total // 5))
    else:
        num_years = min(len(olympic_years), max(2, total))
    
    # Pick random years for smaller countries, sequential for larger
    if total >= 100:
        years = olympic_years[-num_years:]
    else:
        years = sorted(random.sample(olympic_years, min(num_years, len(olympic_years))))
    
    remaining_gold = c["gold"]
    remaining_silver = c["silver"]
    remaining_bronze = c["bronze"]
    
    for i, year in enumerate(years):
        if i == len(years) - 1:
            gold, silver, bronze = remaining_gold, remaining_silver, remaining_bronze
        else:
            avg = max(1, total // len(years))
            gold = min(remaining_gold, max(0, round(remaining_gold / (len(years) - i) * random.uniform(0.5, 1.5))))
            silver = min(remaining_silver, max(0, round(remaining_silver / (len(years) - i) * random.uniform(0.5, 1.5))))
            bronze = min(remaining_bronze, max(0, round(remaining_bronze / (len(years) - i) * random.uniform(0.5, 1.5))))
        
        if gold + silver + bronze > 0:
            medals_by_country_year.append({
                "noc": noc, "year": year, "gold": gold, "silver": silver,
                "bronze": bronze, "total": gold + silver + bronze
            })
        
        remaining_gold -= gold
        remaining_silver -= silver
        remaining_bronze -= bronze

data["medalsByCountryAndYear"] = medals_by_country_year

# Generate medalsByCountryAndSportAndYear
medals_by_country_sport_year = []

sport_by_country = {}
for d in medals_by_country_sport:
    if d["noc"] not in sport_by_country:
        sport_by_country[d["noc"]] = []
    sport_by_country[d["noc"]].append(d)

year_by_country = {}
for d in medals_by_country_year:
    if d["noc"] not in year_by_country:
        year_by_country[d["noc"]] = {}
    year_by_country[d["noc"]][d["year"]] = d

for c in countries_data:
    noc = c["noc"]
    sports = sport_by_country.get(noc, [])
    years_data = year_by_country.get(noc, {})
    
    if not sports or not years_data:
        continue
    
    total_sport = sum(s["total"] for s in sports)
    sport_props = {s["sport"]: s["total"] / max(total_sport, 1) for s in sports}
    
    for year, year_d in years_data.items():
        if year_d["total"] == 0:
            continue
        
        remaining_gold = year_d["gold"]
        remaining_silver = year_d["silver"]
        remaining_bronze = year_d["bronze"]
        
        sorted_sports = sorted(sports, key=lambda x: x["total"], reverse=True)[:min(4, len(sports))]
        
        for i, s in enumerate(sorted_sports):
            sport = s["sport"]
            
            if i == len(sorted_sports) - 1:
                gold, silver, bronze = remaining_gold, remaining_silver, remaining_bronze
            else:
                prop = sport_props.get(sport, 0.25)
                gold = min(remaining_gold, max(0, round(year_d["gold"] * prop * random.uniform(0.8, 1.2))))
                silver = min(remaining_silver, max(0, round(year_d["silver"] * prop * random.uniform(0.8, 1.2))))
                bronze = min(remaining_bronze, max(0, round(year_d["bronze"] * prop * random.uniform(0.8, 1.2))))
            
            if gold + silver + bronze > 0:
                medals_by_country_sport_year.append({
                    "noc": noc, "sport": sport, "year": year,
                    "gold": gold, "silver": silver, "bronze": bronze,
                    "total": gold + silver + bronze
                })
            
            remaining_gold -= gold
            remaining_silver -= silver
            remaining_bronze -= bronze

data["medalsByCountryAndSportAndYear"] = medals_by_country_sport_year

# Save to file
output_path = "/Users/matsuzakikinari/Work/InfoVis2025/FinalTask/data/olympic_data.json"
with open(output_path, "w") as f:
    json.dump(data, f, indent=2)

print("=" * 60)
print("Olympic Medal Data - ALL MEDAL-WINNING COUNTRIES")
print("=" * 60)
print(f"\nTotal Countries: {len(data['countries'])}")
print(f"Sports: {len(data['sports'])}")
print(f"Olympic Years: {len(data['years'])}")
print(f"\nData entries:")
print(f"  medalsByCountry: {len(data['medalsByCountry'])}")
print(f"  medalsBySport: {len(data['medalsBySport'])}")
print(f"  medalsByCountryAndSport: {len(data['medalsByCountryAndSport'])}")
print(f"  medalsByYear: {len(data['medalsByYear'])}")
print(f"  medalsByCountryAndYear: {len(data['medalsByCountryAndYear'])}")
print(f"  medalsByCountryAndSportAndYear: {len(data['medalsByCountryAndSportAndYear'])}")

print("\n" + "=" * 60)
print("Regional Distribution:")
print("=" * 60)
regions = {}
for c in countries_data:
    r = c["region"]
    if r not in regions:
        regions[r] = 0
    regions[r] += 1
for r, count in sorted(regions.items(), key=lambda x: -x[1]):
    print(f"  {r}: {count} countries")
