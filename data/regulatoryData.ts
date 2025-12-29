
export const INITIAL_KNOWLEDGE = `
--- MARCO NORMATIVO ARGENTINO Y NORMAS ISO ---

[DOCUMENTO: LEY 19.587 - HIGIENE Y SEGURIDAD EN EL TRABAJO]
Art. 1.- Las condiciones de higiene y seguridad en el trabajo se ajustaran, en todo el territorio de la república, a las normas de la presente ley...
Art. 4.- La higiene y seguridad en el trabajo comprenderá las normas técnicas y medidas sanitarias, precautorias, de tutela...
Art. 5.- Principios y métodos de ejecución: a) Creación de servicios de higiene y seguridad... i) Aplicación de técnicas de corrección...
Art. 8.- Todo empleador debe adoptar y poner en práctica las medidas adecuadas...
Art. 9.- Obligaciones del empleador: examen pre-ocupacional, mantenimiento de maquinarias, instalación de equipos de renovación de aire...

[DOCUMENTO: DECRETO 351/79 - REGLAMENTARIO LEY 19.587]
TITULO III - Características Constructivas.
Capítulo 5 - Proyecto, instalación, ampliación... Art. 42: Todo establecimiento tendrá adecuado funcionalismo...
TITULO IV - Condiciones de Higiene.
Capítulo 8 - Carga Térmica. Art. 60: Definiciones de Carga Térmica Ambiental...
Capítulo 9 - Contaminación Ambiental. Art. 61: Todo lugar de trabajo... deberá disponer de dispositivos destinados a evitar que dichos contaminantes alcancen niveles que puedan afectar la salud...
Capítulo 12 - Iluminación y Color. Art. 71: La iluminación... deberá cumplimentar... uniformidad, evitar efecto estroboscópico. Anexo IV: Tablas de iluminancia (ver Res. 84/2012).
Capítulo 13 - Ruidos y Vibraciones. Art. 85: Ningún trabajador podrá estar expuesto a una dosis superior a 85/90 dB(A) (ver Res 85/2012).
Capítulo 14 - Instalaciones Eléctricas. Art. 95: Cumplir prescripciones para evitar riesgos.
Capítulo 18 - Protección contra Incendios. Art. 160: Objetivos: dificultar iniciación, evitar propagación, asegurar evacuación...

[DOCUMENTO: RESOLUCIÓN SRT 900/2015 - PROTOCOLO DE MEDICIÓN DE PUESTA A TIERRA (PAT) Y CONTINUIDAD]
Art. 1°. Da carácter obligatorio a la medición de puesta a tierra y verificación de la continuidad de las masas.
Art. 2°. Validez de 12 meses.
Protocolo:
- Verificar el cumplimiento de la Reglamentación AEA 90364.
- Esquemas de conexión: TT, TN-S, IT.
- Valores máximos de Resistencia de PAT en esquema TT: Para I.D. 30mA <= 40 Ohm (preferente <= 10 Ohm para pararrayos).
- Verificación de la continuidad de las masas y del conductor de protección (PE).

[DOCUMENTO: RESOLUCIÓN SRT 85/2012 - PROTOCOLO DE MEDICIÓN DE RUIDO]
Art. 1°. Apruébase el Protocolo para la Medición del nivel de Ruido en el Ambiente Laboral.
Art. 2°. Validez de 12 meses.
Criterios:
- Nivel Sonoro Continuo Equivalente (NSCE) máximo para 8 hs: 85 dBA.
- Tasa de intercambio: 3 dBA.
- Medición con decibelímetro o dosímetro (Clase 2 mínimo).
- Puntos de medición por puesto de trabajo.

[DOCUMENTO: RESOLUCIÓN SRT 886/2015 - PROTOCOLO DE ERGONOMÍA]
Art. 1°. Apruébase el "Protocolo de Ergonomía". Herramienta básica para prevención de trastornos músculo esqueléticos (TME).
Anexo I:
- Planilla 1: Identificación de Factores de Riesgo (Levantamiento de cargas, empuje/arrastre, transporte manual, bipedestación, movimientos repetitivos, posturas forzadas, vibraciones, confort térmico, estrés de contacto).
- Planilla 2: Evaluación Inicial.
- Niveles de Riesgo: 1 (Tolerable), 2 (Moderado), 3 (No Tolerable).
- Medidas preventivas administrativas y de ingeniería.

[DOCUMENTO: RESOLUCIÓN SRT 84/2012 - PROTOCOLO DE ILUMINACIÓN]
Art. 1°. Apruébase el Protocolo para la Medición de la Iluminación.
Art. 2°. Validez de 12 meses.
Referencia: Decreto 351/79 Anexo IV.
Tabla 1 (Ejemplos):
- Visión ocasional: 100 lux.
- Tareas intermitentes, fáciles: 100-300 lux.
- Tareas moderadas, oficina: 500 lux.
- Tareas finas: 750-1500 lux.
- Tareas muy finas: 1500-3000 lux.
Uniformidad: E min / E media >= 0.5.

[DOCUMENTO: LEY 24.557 - RIESGOS DEL TRABAJO (LRT)]
Objetivos: Reducir la siniestralidad laboral a través de la prevención. Reparar los daños derivados de accidentes de trabajo y enfermedades profesionales.
Art. 4: Obligaciones de adoptar medidas legalmente previstas para prevenir riesgos.
Art. 6: Contingencias cubiertas (Accidente de trabajo, Accidente in itinere, Enfermedad Profesional).

[DOCUMENTO: ISO 14001:2015 - SISTEMAS DE GESTIÓN AMBIENTAL]
Requisitos con orientación para su uso.
4.1 Comprensión de la organización y su contexto.
6.1.2 Aspectos ambientales significativos (ciclo de vida).
6.1.3 Obligaciones de cumplimiento (requisitos legales).
8.1 Planificación y control operacional (eliminación, sustitución, ingeniería, administrativos).
8.2 Preparación y respuesta ante emergencias.

[DOCUMENTO: ISO 9001:2008 - SISTEMAS DE GESTIÓN DE CALIDAD]
Enfoque basado en procesos.
4.1 Requisitos generales (documentar, implementar, mantener SGC).
4.2.3 Control de documentos.
4.2.4 Control de registros.
6.2 Recursos humanos (competencia, formación, toma de conciencia).
6.3 Infraestructura.
6.4 Ambiente de trabajo.
7.1 Planificación de la realización del producto.
8.2.3 Seguimiento y medición de los procesos.
8.5.2 Acción correctiva. 8.5.3 Acción preventiva.

--- LISTADOS ESTANDARIZADOS DE PELIGROS Y RIESGOS ---

[02. LISTA DE IDENTIFICACIÓN DE PELIGROS]
Utilizar ESTRICTAMENTE estos códigos y descripciones (1 al 28) para la identificación de peligros:

1. Explosión: Accidentes producidos por un aumento brusco de volumen de una sustancia o por reacciones químicas violentas en un determinado medio. Incluye la rotura de recipientes a presión, la deflagración de nubes de productos inflamables, etc.
2. Incendio: Accidentes producidos por efectos del fuego o sus consecuencias.
3. Contactos térmicos: Accidentes debidos a las temperaturas que tienen los objetos que entren en contacto con cualquier parte del cuerpo (se incluyen líquidos o sólidos). Si coincide con el peligro 21 de esta lista, prevalece este último.
4. Contactos eléctricos: Se incluyen todos los accidentes cuya causa sea la electricidad.
5. Contactos con sustancias cáusticas o corrosivas: Considera los accidentes por contacto con sustancias y productos que den lugar a lesiones externas y que en su hoja de seguridad estén definidos como cáusticos o corrosivos.
6. Inhalación, contacto cutáneo o ingestión de sustancias nocivas: Contempla los accidentes debidos a estar en una atmósfera tóxica, o tener contacto cutáneo o a la ingesta de productos nocivos. Se incluyen las asfixias y ahogos. Se exceptúan los peligros que puedan caer en el número 05.
7. Caídas de personas a distinto nivel: Incluye tanto las caídas de alturas (edificios, andamios, máquinas, vehículos, etc.) como en profundidades (puentes, excavaciones, aberturas de tierra, piletas, etc.).
8. Caídas de personas al mismo nivel: Incluye caídas en lugares de paso o superficies de trabajo que ocurren al mismo nivel, es decir desde la superficie donde se produce la caída hasta la superficie donde cae la persona no existe diferencia de altura.
9. Caídas de objetos por desplome: Incluye el desplome de edificios, muros, andamios, escaleras, mercancías apiladas, etc., así como los hundimientos de masas de tierra, rocas, aludes, etc.
10. Caídas de objetos en manipulación: Incluye las caídas de herramientas, materiales, etc., sobre un trabajador, siempre que el accidentado sea la misma persona a la cual le caiga el objeto que estaba manipulando.
11. Caídas de objetos desprendidos: Incluye las caídas de herramientas, materiales, etc. encima un trabajador, siempre que éste no los estuviera manipulando.
12. Pisadas sobre objetos: Incluye los accidentes que dan lugar a lesiones como consecuencia de pisadas sobre objetos.
13. Choques contra objetos inmóviles: Incluye los peligros de que el trabajador golpee contra objetos inmóviles.
14. Choques y contactos contra elementos móviles de la máquina: Incluye los golpes, cortes, rascadas, etc., que el trabajador pueda ocasionarse por elementos móviles de máquinas e instalaciones (no se incluyen los atrapamientos del peligro 18).
15. Golpes por objetos o herramientas: El trabajador es lesionado por un objeto o herramienta que se mueve por fuerzas diferentes a la de la gravedad. Se incluyen martillazos, golpes con otras herramientas u objetos (maderas, piedras, hierros, etc.) No se incluyen los golpes por caída de objetos.
16. Atropellos, golpes o choques, contra o con vehículos: Incluye los atropellos de personas por vehículos, así como los accidentes de vehículos en que el trabajador lesionado va sobre el vehículo. No se incluyen los accidentes de tráfico.
17. Proyección de fragmentos o partículas: Incluye los peligros de proyección sobre el trabajador de partículas o fragmentos voladores procedentes de una máquina o herramienta, voladuras, etc.
18. Atrapamiento por o entre objetos: Incluye el atrapamiento por elementos de máquinas, diversos materiales, etc.
19. Atrapamiento por vuelco de máquinas: Incluye los atrapamientos debidos a vuelcos de tractores, vehículos y otras máquinas, quedando el trabajador atrapado por ellos.
20. Sobreesfuerzos: Incluye peligros originados por la manipulación de cargas o por movimientos mal realizados.
21. Exposición a temperaturas extremas: Incluye la exposición del trabajador a temperaturas extremas (ambientes excesivamente fríos o calientes) que puedan producirle alteraciones fisiológicas.
22. Exposición a radiaciones: Incluye la exposición del trabajador tanto variables físico-químicas dañinas: radiaciones ionizantes, radiaciones no ionizantes, otras.
23. Causados por seres vivos: Incluye los peligros asociados a posibles interacciones con personas o animales, ya sean agresiones, molestias, mordeduras, picaduras, etc.
24. Accidentes de tráfico: Incluye los accidentes de tráfico ocurridos dentro del horario laboral independientemente que sea su trabajo habitual o no.
25. Agentes químicos: Están constituidos por materia inerte (no viva) que puede estar presente en el aire bajo diferentes formas: polvo, gas, vapor, niebla, etc. Considera la condición de trabajo como situación presente y habitual en el entorno laboral y no a la posibilidad de accidente por inhalación, contacto o ingestión de químicos (esta última deberá encuadrarse en los peligros 05 y 06 según corresponda). Para su evaluación se tendrán en cuenta las mediciones y estudios respectivos.
26. Agentes físicos: Están constituidos por las diversas formas en que se manifiesta la energía, tal como el ruido, las vibraciones, carga térmica, iluminación, etc. Considera la condición de trabajo como situación presente y habitual en el entorno laboral y no a la posibilidad de accidente por algún agente físico (esta última deberá encuadrarse en los peligros 21 o 22 según corresponda). Para su evaluación se tendrán en cuenta las mediciones y estudios respectivos.
27. Agentes biológicos: están constituídos por seres vivos microscópicos, tal como vírus, bactérias, hongos o parasitos, etc. Para su evaluación se tendrán en cuenta las mediciones y estudios respectivos.
28. Otros: Cualquier otro tipo de peligro no contemplado en los apartados anteriores, tales como: Choque eléctrico por caída de rayo, etc., Asfixia por inmersión: ahogamiento por caída al agua en mares, lagos, cruzando ríos o lagunas, etc., Aspectos Ergonómicos: diseños fuera estándar, Sensibilidades especiales: el grupo evaluador, con el apoyo y las indicaciones del Servicio Médico, deben identificar aquellos factores y sensibilidades propios del puesto de trabajo y que deben requerir medidas de prevención y precaución especiales para ciertas personas, Agentes Psicosociales: Presión, stress, fatiga, rutina, vida en campamentos, etc.
`;
