'use client'

import Image from "next/image";
import React, {useState} from "react";
import {useRef} from "react";

export default function Home() {
    
    const [passwordValue, setPasswordValue] = useState('');
    const [confirmValue, setConfirmValue] = useState('');
    const [passwordChangeResponseText, setPasswordChangeResponseText] = useState('');
    const [passwordChangeStatus, setPasswordChangeStatus] = useState(false);

    function handlePasswordFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
	setPasswordChangeResponseText('');
	setPasswordValue(e.target.value);
    }

    // the following method is most likely overkill and is redundant with the other checks, however, i spent a while working out the regex and so it shall stay

    const validatePassword = (password: string) => {
		// following regex does the following:
	// 	^ -> start of word
	// 	(?=.*?[XXX]) -> look ahead / match any character / between zero and unlimited times/ that matches any of the characters in XXX
	// 		three matching groups for characters a-z lower and upper case, digits from 0-9 and for any of the valid 'special' characters
	// 	make sure that the characters in the password are only the allowed alphanumerics and special characters
	//	{7,14} -> match the previous tokens only between 7-14 times
	//	$ -> match the end of the password
	const regex = new RegExp('^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[!£$^*#])[a-zA-Z0-9!£$^*#]{7,14}$');
	return regex.test(password)

    };
	
    const validatePasswordLength = (password: string) => {
	// check if all of the characters between the start and end of the password add to 7-14 characters
	const regex = new RegExp('^.{7,14}$');
	return regex.test(password);
    };
    
    const validatePasswordMinimumCharacters = (password: string) => {
	// look ahead for the special characters and digits and match them at least once
	const regex = new RegExp('^(?=.*?[!£$^*#])(?=.*?[0-9]).*$');
	return regex.test(password);
    };
    
    const validatePasswordSpecialCharacters = (password: string) => {
	// check for any characters not in the allowed list
    	const regex = new RegExp('^[a-zA-Z0-9!£$^*#]*$');
	return regex.test(password);
    }

    const validatePasswordConfirmMatch = (passwordVal: string, confirmVal: string) => {
	return passwordVal === confirmVal;
    }

    const passwordValueValid = validatePassword(passwordValue);
    const validPasswordLength = validatePasswordLength(passwordValue);
    const validPasswordMinimumCharacters = validatePasswordMinimumCharacters(passwordValue);
    const validPasswordSpecialCharacters = validatePasswordSpecialCharacters(passwordValue);
    const validPasswordConfirmMatch = validatePasswordConfirmMatch(passwordValue, confirmValue);
    const disableButton = !(validPasswordLength && validPasswordMinimumCharacters && validPasswordSpecialCharacters && validPasswordConfirmMatch);

    async function handleFormSubmit(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
	if(passwordValueValid && validPasswordLength && validPasswordMinimumCharacters && validPasswordSpecialCharacters) {
		const response = await fetch("https://localhost:7144/Password/change", {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({password: passwordValue})
		});
		if(response.status == 200) {
			console.log("SUCCESSFUL PASSWORD CHANGE");
			setPasswordChangeResponseText('Password changed successfully!');
			setPasswordChangeStatus(true);
		}
		else {
			console.log("ERROR DURING PASSWORD CHANGE");
			setPasswordChangeResponseText('Error during password change');
			setPasswordChangeStatus(false);
		}
	}
    }

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <Image src="/strive-logo.jpg" alt="Strive Gaming" height="110" width="110" className="mx-auto"/>
                    <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
                        data-testid="title">
                        Change your password
                    </h2>
                </div>

                <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="password"
                                   className="block text-sm font-medium leading-6 text-gray-900">
                                New password
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    data-testid="password"
				    value={passwordValue}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    onChange={handlePasswordFieldChange}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="confirm" className="block text-sm font-medium leading-6 text-gray-900">
                                    Re-type new password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="confirm"
				    value={confirmValue}
                                    name="confirm"
                                    type="password"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
				    onChange={(e) => setConfirmValue(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                className={"flex w-full justify-center bg-gray-900 hover:bg-gray-700 active:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400 px-4 py-2 rounded-md text-white"}
                                onClick={(e) => handleFormSubmit(e)}
				disabled={disableButton}>
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
		<div className={`text-center text-l font-bold leading-9 tracking-tight ${passwordChangeStatus ? 'text-green-600' :'text-red-600'}`}>
			{passwordChangeResponseText}	
		</div>
                <div className="mx-auto text-xs mt-8">
                    <ol>

                        <li className={`${validPasswordLength ? 'text-green-600 bi-check-lg' : 'text-red-600 bi-x-lg'}`}>
			Password must be between 7-14 characters in length</li>
                        <li className={`${validPasswordMinimumCharacters ? 'text-green-600 bi-check-lg' : 'text-red-600 bi-x-lg'}`}>
			Password must contain at least 1 number and one special characters</li>
                        <li className={`${validPasswordSpecialCharacters ? 'text-green-600 bi-check-lg' : 'text-red-600 bi-x-lg'}`}>
			Password does not contain special characters other than <code>!£$^*#</code></li>
                        <li className={`${validPasswordConfirmMatch ? 'text-green-600 bi-check-lg' : 'text-red-600 bi-x-lg'}`}>
			Both passwords must be identical</li>
                    </ol>
                </div>
            </div>
        </>
    );
}
