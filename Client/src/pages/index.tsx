'use client'

import Image from "next/image";
import React, {useState} from "react";
import {useRef} from "react";

export default function Home() {
     
    // there's 100% a better way of handling multiple related states
    // i'd need to redo how these states function as currently, they will only 
    // 	be considered valid when all of the checks pass AND one of the fields changes
    //	meaning that the passwords won't match correctly as i am checking whether they WERE valid PRIOR to one of them updating
    const [validPasswordLength, setValidPasswordLength] = useState(false);
    const [validMinimumCharacters, setValidMinimumCharacters] = useState(false);
    const [validSpecialCharacters, setValidSpecialCharacters] = useState(false);
    const [validIdenticalPasswords, setValidIdenticalPasswords] = useState(false);
    const passwordInput = useRef(null);
    const confirmInput = useRef(null);

    function handlePasswordFieldChange(e: React.ChangeEvent<HTMLInputElement>) {
	setValidPasswordLength(validatePasswordLength(e.target.value));
	setValidMinimumCharacters(validatePasswordMinimumCharacters(e.target.value));
	setValidSpecialCharacters(validatePasswordSpecialCharacters(e.target.value));
	setValidIdenticalPasswords(validatePasswordsEqual(e.target.value));
	console.log(validPasswordLength, validMinimumCharacters, validSpecialCharacters, validIdenticalPasswords);
    }
    
    function validatePasswordLength(password: string) {
	// match any characters as long as the string is between 7 and 14 characters
	const regex = new RegExp('^.{7,14}$');
	return regex.test(password);
    }

    function validatePasswordMinimumCharacters(password: string) {
	// look ahead for the special characters and digits and match them at least once
	const regex = new RegExp('^(?=.*?[!£$^*#])(?=.*?[0-9]).*$');
	return regex.test(password);
    }

    function validatePasswordSpecialCharacters(password: string) {
	// check for any characters not in the allowed list
    	const regex = new RegExp('([^a-zA-Z0-9!£$^*#\d\s])');
	return !regex.test(password);
    }

    function validatePasswordsEqual(password: string) {
	// this feels wrong
	return password === confirmInput.current.value;
    }

    function isPasswordValidRegex(password: string) {
	// following regex does the following:
	// 	^ -> start of word
	// 	(?=.*?[XXX]) -> look ahead / match any character / between zero and unlimited times/ that matches any of the characters in XXX
	// 		three matching groups for characters a-z lower and upper case, digits from 0-9 and for any of the valid 'special' characters
	// 	make sure that the characters in the password are only the allowed alphanumerics and special characters
	//	{7,14} -> match the previous tokens only between 7-14 times
	//	$ -> match the end of the password
	const regex = new RegExp('^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[!£$^*#])[a-zA-Z0-9!£$^*#]{7,14}$');
	console.log(regex.test(password));
	return regex.test(password)
    }
    
    async function handleFormSubmit(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
	if(isPasswordValidRegex(passwordInput.current.value) 
		&& isPasswordValidRegex(confirmInput.current.value)
		&& (confirmInput.current.value === passwordInput.current.value)) {
		console.log("VALID PASSWORDS");
		const response = await fetch("https://localhost:7144/Password/change", {
			method: 'POST',
			headers: {'Content-Type': 'application/json'},
			body: JSON.stringify({password: passwordInput.current.value})
		});
		console.log(response);
	}
        console.log('Post password to back end');
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
				    ref={passwordInput}
                                    name="password"
                                    type="password"
                                    data-testid="password"
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
				    ref={confirmInput}
                                    name="confirm"
                                    type="password"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
				    onChange={handlePasswordFieldChange}
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                className={"flex w-full justify-center bg-gray-900 hover:bg-gray-700 active:bg-gray-800 px-4 py-2 rounded-md text-white"}
                                onClick={(e) => handleFormSubmit(e)}>
                                Submit
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mx-auto text-xs mt-8">
                    <ol>
                        <li>
                            Password must be between 7-14 characters in length
                        </li>
                        <li>
                            Password must contain at least 1 number and one special characters
                        </li>
                        <li>
                            Password does not contain special characters other than <code>!£$^*#</code>
                        </li>
                        <li>
                            Both passwords must be identical
                        </li>
                    </ol>
                </div>
            </div>
        </>
    );
}
