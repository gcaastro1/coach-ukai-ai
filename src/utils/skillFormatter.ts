export const formatSkillDescription = (description: string, parametersString: string, level: number): string => {
  if (!parametersString) return description.replace('{0}', level.toString());

  try {
    const params: string[] = JSON.parse(parametersString);
    let formattedDesc = description.replace('{0}', level.toString());
    
    // params is an array like ["1/2/3", "120/135/150"]
    params.forEach((paramStr, index) => {
      const values = paramStr.split('/');
      // Se tivermos valores separados por '/', pegamos o valor no indice (level - 1),
      // se passar do limite ou se for um valor único, pegamos o último/único
      const val = values[Math.min(level - 1, values.length - 1)] || values[0];
      formattedDesc = formattedDesc.replace(`{${index + 1}}`, val);
    });

    return formattedDesc;
  } catch (e) {
    console.error("Failed to parse skill parameters", e);
    return description;
  }
};
