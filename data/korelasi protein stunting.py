import json
import pandas as pd
from scipy import stats

with open("data_provinsi.json", "r", encoding="utf-8") as f:
    data = json.load(f)

df = pd.DataFrame(data)

stunting_cols = ["Stunting 5-12", "Stunting 13-15", "Stunting 16-18"]
protein_col = "Protein (gr)"

print("=" * 55)
print("  KORELASI PROTEIN vs STUNTING (Pearson Correlation)")
print("=" * 55)

for col in stunting_cols:
    r, p = stats.pearsonr(df[protein_col], df[col])
    signifikan = "✓ Signifikan" if p < 0.05 else "✗ Tidak Signifikan"
    print(f"\n{protein_col} vs {col}:")
    print(f"  r = {r:.4f}  |  p-value = {p:.4f}  |  {signifikan}")

# Korelasi dengan rata-rata stunting semua kelompok usia
df["Rata-rata Stunting"] = df[stunting_cols].mean(axis=1)
r, p = stats.pearsonr(df[protein_col], df["Rata-rata Stunting"])
signifikan = "✓ Signifikan" if p < 0.05 else "✗ Tidak Signifikan"
print(f"\n{protein_col} vs Rata-rata Stunting (semua usia):")
print(f"  r = {r:.4f}  |  p-value = {p:.4f}  |  {signifikan}")

print("\n" + "=" * 55)
print("Interpretasi nilai r:")
print("  0.00 - 0.19 : Sangat lemah")
print("  0.20 - 0.39 : Lemah")
print("  0.40 - 0.59 : Sedang")
print("  0.60 - 0.79 : Kuat")
print("  0.80 - 1.00 : Sangat kuat")
print("  (negatif = semakin tinggi protein, stunting makin turun)")
print("=" * 55)