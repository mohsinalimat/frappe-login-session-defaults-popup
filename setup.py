from setuptools import setup, find_packages

with open('requirements.txt') as f:
    install_requires = f.read().strip().split('\n')

from frappe_login_session_defaults_popup import __version__ as version

setup(
    name='frappe_login_session_defaults_popup',
    version=version,
    description='Frappe plugin that shows the session defaults popup after login.',
    author='Ameen Ahmed (Level Up)',
    author_email='kid1194@gmail.com',
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=install_requires
)
