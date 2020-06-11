function GenerateSettings(props) {
  return (
    <Page>
      <Text>Welcome to the setting page. Please enter your tesla credentials bellow.</Text>
      <TextInput label="User account (email)" type="email" settingsKey="userEmail" />
      <TextInput label="Password" type="password" settingsKey="userPassword" />
      <TextInput label="Car Name (use if multiple cars)" type="email" settingsKey="carName" />
      
      <Section title={<Text bold align="center">About</Text>}>
        <Text>Version : 0.1 - Alpha</Text>
        <Text>Made with EV love by Remy GRANDIN.</Text>        
        <Link source="https://github.com/remygrandin/Tuskla">Under MIT Liscence. Source code available here</Link>
        <Link source="https://www.streamlineicons.com/">Free Icons from the Streamline Icons Pack</Link>
      </Section>
    </Page>
    );
}

registerSettingsPage(GenerateSettings);