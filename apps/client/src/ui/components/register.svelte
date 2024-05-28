<script lang="ts">
	import { gameApp } from '../../main';
	import { AppStates, appState } from '../../routes/store';

	let email: string = '';
	let password: string = '';
	let errorMessage: string = '';
	let successMessage: string = '';

	function goToLogin() {
		appState.set(AppStates.STATE_LOGIN);
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		try {
			const response = await fetch('http://localhost:3000/auth/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			});

			if (response.ok) {
				successMessage = 'Account successfully created!';
			} else {
				const errorData = await response.json();
				// Handle error response
				errorMessage = errorData.message || 'Authentication failed';
			}
		} catch (error) {
			errorMessage = 'An error occurred during authentication';
			console.error('Error:', error);
		}
	}
</script>

<div
	class="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm p-4 sm:p-6 lg:p-8 dark:bg-gray-800 dark:border-gray-700"
>
	<form class="space-y-6" on:submit={handleSubmit}>
		<h3 class="text-xl text-center font-medium text-gray-900 dark:text-white">Sign up</h3>
		{#if errorMessage}
			<div class="text-red-500">{errorMessage}</div>
		{/if}
		{#if successMessage}
			<div class="text-green-500">{successMessage}</div>
		{/if}
		<div>
			<label for="email" class="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
				>Your email</label
			>
			<input
				type="email"
				name="email"
				id="email"
				bind:value={email}
				class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
				placeholder="address@mail.com"
				required
			/>
		</div>
		<div>
			<label for="password" class="text-sm font-medium text-gray-900 block mb-2 dark:text-gray-300"
				>Your password</label
			>
			<input
				type="password"
				name="password"
				id="password"
				bind:value={password}
				placeholder="••••••••"
				class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
				required
			/>
		</div>
		<button
			type="submit"
			class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
			>Confirm</button
		>
		<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
			Already registered? <button
				on:click={goToLogin}
				class="text-blue-700 hover:underline dark:text-blue-500">Login</button
			>
		</div>
	</form>
</div>
