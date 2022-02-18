import type { Component } from 'solid-js';
import getRandomString from './utils/get-random-string';
import ToJSON from './components/ToJSON';
import getRandomNumber from './utils/get-random-number';
import getRandomTeam from './utils/get-random-team';
import { createFormGroup, formGroup } from './lib';

import './App.css';

const App: Component = () => {
  const [form, setForm] = createFormGroup({
    firstName: 'Thomas',
    email: 'thomas@thomas.com',
    password: '',
    phoneNumber: '',
    personalSite: '',
    age: 25,
    skillLevel: 20,
    team: '',
    acceptTerms: Math.random() < 0.5,
  });

  // TODO for testing - remove when redundant
  // setInterval(() => console.log(form()), 1000);

  return (
    <>
      <ToJSON value={form()} />

      <form use:formGroup={[form, setForm]}>
        <label htmlFor="firstName">First name</label>
        <input id="firstName" type="text" formControlName="firstName" />

        <label htmlFor="email">Email</label>
        <input id="email" type="email" formControlName="email" />

        <label htmlFor="password">Password</label>
        <input id="password" type="password" formControlName="password" />

        <label htmlFor="phoneNumber">Phone number</label>
        <input id="phoneNumber" type="tel" formControlName="phoneNumber" />

        <label htmlFor="personalSite">Personal site URL</label>
        <input id="personalSite" type="url" formControlName="personalSite" />

        <label htmlFor="age">Age</label>
        <input id="age" type="number" formControlName="age" />

        <label htmlFor="skillLevel">Skill level</label>
        <input id="skillLevel" type="range" formControlName="skillLevel" />

        <div>Team:</div>
        <input type="radio" id="radioEngineering" name="team" value="engineering" formControlName="team" />
        <label htmlFor="radioEngineering">Engineering</label>
        <input type="radio" id="radioProduct" name="team" value="product" formControlName="team" />
        <label htmlFor="radioProduct">Product</label>
        <input type="radio" id="radioTesting" name="team" value="testing" formControlName="team" />
        <label htmlFor="radioTesting">Testing</label>
        <br />

        <label htmlFor="acceptTerms">Accept terms</label>
        <input id="acceptTerms" type="checkbox" formControlName="acceptTerms" />
      </form>

      <button onClick={() => setForm((s) => ({ ...s, firstName: getRandomString() }))}>
        Change firstName
      </button>
      <button onClick={() => setForm((s) => ({ ...s, phoneNumber: getRandomString() }))}>
        Change phone number
      </button>
      <button onClick={() => setForm((s) => ({ ...s, age: getRandomNumber() }))}>Change age</button>
      <button onClick={() => setForm((s) => ({ ...s, skillLevel: 50 }))}>Change skillLevel</button>
      <button onClick={() => setForm((s) => ({ ...s, team: getRandomTeam() }))}>Change team</button>
      <button onClick={() => setForm((s) => ({ ...s, acceptTerms: !s.acceptTerms }))}>
        Change acceptTerms
      </button>
    </>
  );
};

export default App;
